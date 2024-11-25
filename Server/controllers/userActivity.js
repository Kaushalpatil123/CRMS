const UserActivity = require("../models/userActivity");
const moment = require('moment-timezone');

const convertToIST = (utcTime) => moment(utcTime).tz('Asia/Kolkata');

function calculateBreakSummary(breaks) {
  const breakTypes = ['LUNCH BREAK', 'TEA BREAK', 'TEAM MEETING', 'OUT OF OFFICE', 'CLIENT VISIT'];
  const summary = {};

  breakTypes.forEach(type => {
    const typeBreaks = breaks.filter(b => b.nameOfBreak === type);
    const totalMinutes = typeBreaks.reduce((sum, b) => {
      if (b.endTime) {
        return sum + moment(b.endTime).diff(moment(b.startTime), 'minutes');
      }
      return sum;
    }, 0);
    summary[type] = totalMinutes;
  });

  return summary;
}

exports.userLogin = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    let userActivity = await UserActivity.findOne({ user: userId });

    if (!userActivity) {
      userActivity = new UserActivity({ user: userId });
    }

    if (userActivity.isLoggedIn) {
      const currentSession = userActivity.sessions[userActivity.sessions.length - 1];
      currentSession.loginTime = now;
      currentSession.breaks = [];
      currentSession.workTime = 0;
      currentSession.breakTime = 0;
    } else {
      userActivity.sessions.push({ loginTime: now });
    }

    userActivity.lastLoginTime = now;
    userActivity.isLoggedIn = true;

    await userActivity.save();
    res.status(200).json({ message: "Login recorded successfully", loginTime: convertToIST(now).format() });
  } catch (error) {
    res.status(500).json({ message: "Error recording login", error: error.message });
  }
};

// exports.userLogout = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const now = new Date(); 

//     const userActivity = await UserActivity.findOne({ user: userId, isLoggedIn: true });

//     if (!userActivity) {
//       return res.status(404).json({ message: "No active session found" });
//     }

//     const currentSession = userActivity.sessions[userActivity.sessions.length - 1];
//     currentSession.logoutTime = now;

//     let workTime = moment(now).diff(moment(currentSession.loginTime), 'minutes');
//     let breakTime = 0;

//     currentSession.breaks.forEach(breakPeriod => {
//       if (breakPeriod.endTime) {
//         breakTime += moment(breakPeriod.endTime).diff(moment(breakPeriod.startTime), 'minutes');
//       } else {
//         breakTime += moment(now).diff(moment(breakPeriod.startTime), 'minutes');
//       }
//     });

//     workTime -= breakTime;

//     currentSession.workTime = workTime;
//     currentSession.breakTime = breakTime;

//     userActivity.lastLogoutTime = now;
//     userActivity.isLoggedIn = false;

//     await userActivity.save();
//     res.status(200).json({ 
//       message: "Logout recorded successfully", 
//       logoutTime: convertToIST(now).format(), 
//       workTime, 
//       breakTime 
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error recording logout", error: error.message });
//   }
// };


// exports.userLogout = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const now = new Date();

//     const userActivity = await UserActivity.findOne({ user: userId, isLoggedIn: true });

//     if (!userActivity) {
//       return res.status(404).json({ message: "No active session found" });
//     }

//     const currentSession = userActivity.sessions[userActivity.sessions.length - 1];
//     currentSession.logoutTime = now;

//     // Calculate work time
//     let workTime = moment(now).diff(moment(currentSession.loginTime), 'minutes');

//     // Calculate break time
//     let breakTime = 0;
//     currentSession.breaks.forEach(breakPeriod => {
//       if (breakPeriod.endTime) {
//         breakTime += moment(breakPeriod.endTime).diff(moment(breakPeriod.startTime), 'minutes');
//       } else {
//         breakTime += moment(now).diff(moment(breakPeriod.startTime), 'minutes');
//       }
//     });

//     // Calculate idle time
//     let idletimes = 0;
//     currentSession.idletime.forEach(idlePeriod => {
//       if (idlePeriod.endTime) {
//         idletimes += moment(idlePeriod.endTime).diff(moment(idlePeriod.startTime), 'minutes');
//       } else {
//         idletimes += moment(now).diff(moment(idlePeriod.startTime), 'minutes');
//       }
//     });

//     // Subtract break and idle times from work time
//     workTime -= (breakTime + idletimes);

//     currentSession.workTime = workTime;
//     currentSession.breakTime = breakTime;
//     currentSession.idletimes = idletimes;

//     userActivity.lastLogoutTime = now;
//     userActivity.isLoggedIn = false;

//     await userActivity.save();
//     res.status(200).json({
//       message: "Logout recorded successfully",
//       logoutTime: convertToIST(now).format(),
//       workTime,
//       breakTime,
//       idletimes
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error recording logout", error: error.message });
//   }
// };

exports.userLogout = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const userActivity = await UserActivity.findOne({ user: userId, isLoggedIn: true });

    if (!userActivity) {
      return res.status(404).json({ message: "No active session found" });
    }

    const currentSession = userActivity.sessions[userActivity.sessions.length - 1];
    currentSession.logoutTime = now;

    // Calculate work time in minutes
    let loginTime = new Date(currentSession.loginTime);
    let workTime = Math.max(0, Math.floor((now - loginTime) / 60000));

    // Calculate break time
    let breakTime = 0;
    currentSession.breaks.forEach(breakPeriod => {
      let startTime = new Date(breakPeriod.startTime);
      let endTime = breakPeriod.endTime ? new Date(breakPeriod.endTime) : now;
      if (endTime >= startTime) {
        breakTime += Math.floor((endTime - startTime) / 60000);
      }
    });

    // Calculate idle time
    let idletimes = 0;
    currentSession.idletime.forEach(idlePeriod => {
      let startTime = new Date(idlePeriod.startTime);
      let endTime = idlePeriod.endTime ? new Date(idlePeriod.endTime) : now;
      if (endTime >= startTime) {
        idletimes += Math.floor((endTime - startTime) / 60000);
      }
    });

    // Subtract break and idle times from work time
    workTime = Math.max(0, workTime - (breakTime + idletimes));

    currentSession.workTime = workTime;
    currentSession.breakTime = breakTime;
    currentSession.idletimes = idletimes;

    userActivity.lastLogoutTime = now;
    userActivity.isLoggedIn = false;

    await userActivity.save();
    res.status(200).json({
      message: "Logout recorded successfully",
      logoutTime: now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }), // Convert to IST
      workTime,
      breakTime,
      idletimes
    });
  } catch (error) {
    res.status(500).json({ message: "Error recording logout", error: error.message });
  }
};


exports.startBreak = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const { nameOfBreak } = req.body;

    if (!['LUNCH BREAK', 'TEA BREAK', 'TEAM MEETING', 'OUT OF OFFICE', 'CLIENT VISIT'].includes(nameOfBreak)) {
      return res.status(400).json({ message: "Invalid break name" });
    }

    const userActivity = await UserActivity.findOne({ user: userId, isLoggedIn: true });

    if (!userActivity) {
      return res.status(404).json({ message: "No active session found" });
    }

    const currentSession = userActivity.sessions[userActivity.sessions.length - 1];
    currentSession.breaks.push({ nameOfBreak, startTime: now });

    await userActivity.save();
    res.status(200).json({ message: "Break start recorded successfully", breakStartTime: convertToIST(now).format(), nameOfBreak });
  } catch (error) {
    res.status(500).json({ message: "Error recording break start", error: error.message });
  }
};

exports.endBreak = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const userActivity = await UserActivity.findOne({ user: userId, isLoggedIn: true });

    if (!userActivity) {
      return res.status(404).json({ message: "No active session found" });
    }

    const currentSession = userActivity.sessions[userActivity.sessions.length - 1];
    const currentBreak = currentSession.breaks[currentSession.breaks.length - 1];

    if (!currentBreak || currentBreak.endTime) {
      return res.status(400).json({ message: "No active break found" });
    }

    currentBreak.endTime = now;

    await userActivity.save();
    res.status(200).json({ message: "Break end recorded successfully", breakEndTime: convertToIST(now).format(), nameOfBreak: currentBreak.nameOfBreak });
  } catch (error) {
    res.status(500).json({ message: "Error recording break end", error: error.message });
  }
};

exports.startIdleTime = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    
    const userActivity = await UserActivity.findOne({ user: userId, isLoggedIn: true });
    
    if (!userActivity) {
      return res.status(404).json({ message: "No active session found" });
    }
    
    const currentSession = userActivity.sessions[userActivity.sessions.length - 1];
    
    if (!currentSession.idletime) {
      currentSession.idletime = [];
    }

    currentSession.idletime.push({ startTime: now });
    
    await userActivity.save();
    
    res.status(200).json({ 
      message: "Idle time start recorded successfully", 
      idleStartTime: convertToIST(now).format() 
    });
  } catch (error) {
    console.error("Error in startIdleTime:", error);
    res.status(500).json({ message: "Error recording idle time start", error: error.message });
  }
};

exports.endIdleTime = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    // Find the active session for the user
    const userActivity = await UserActivity.findOne({ user: userId, isLoggedIn: true });

    if (!userActivity) {
      return res.status(404).json({ message: "No active session found" });
    }

    // const currentSession = userActivity.sessions[userActivity.sessions.length - 1];

    const currentSession = userActivity.sessions[userActivity.sessions.length - 1];
    const currentIdleTime = currentSession.idletime[currentSession.idletime.length - 1];


    // Ensure idealtime array exists
    if (!currentIdleTime || currentIdleTime.endTime) {
      return res.status(400).json({ message: "No active idle time found" });
    }

    currentIdleTime.endTime = now;

    await userActivity.save();

    res.status(200).json({
      message: "Idle time end recorded successfully",
      idleEndTime: convertToIST(now).format()
    });
  } catch (error) {
    res.status(500).json({ message: "Error recording idle time end", error: error.message });
  }
};


exports.getAllUsersActivity = async (req, res) => {
  try {
    const userActivities = await UserActivity.find().populate('user', 'userName');
    console.log(userActivities)
    const formattedActivities = userActivities.map(activity => {
      const lastSession = activity.sessions[activity.sessions.length - 1] || {};
      const breakSummary = calculateBreakSummary(lastSession.breaks);

  
      return {
        userId: activity.user._id,
        userName: activity.user.userName,
        lastLoginTime: activity.lastLoginTime ? convertToIST(activity.lastLoginTime).format() : null,
        lastLogoutTime: activity.lastLogoutTime ? convertToIST(activity.lastLogoutTime).format() : null,
        isLoggedIn: activity.isLoggedIn,
        totalWorkTime: activity.sessions.reduce((sum, session) => sum + (session.workTime || 0), 0),
        totalBreakTime: activity.sessions.reduce((sum, session) => sum + (session.breakTime || 0), 0),
        lastSessionWorkTime: lastSession.workTime || 0,
        lastSessionBreakTime: lastSession.breakTime || 0,
        lastSessionIdealTime: lastSession.idletimes,
        lastSessionLoginTime: lastSession.loginTime ? convertToIST(lastSession.loginTime).format() : null,
        lastSessionLogoutTime: lastSession.logoutTime ? convertToIST(lastSession.logoutTime).format() : null,
        lastSessionBreakSummary: breakSummary
      };
    });

    res.status(200).json({ userActivities: formattedActivities });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user activities", error: error.message });
  }
};

exports.getUserActivityById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userActivity = await UserActivity.findOne({ user: userId }).populate('user', 'userName');

    if (!userActivity) {
      return res.status(404).json({ message: "User activity not found" });
    }
    console.log(userActivity)
    const formattedSessions = userActivity.sessions.map(session => ({
      loginTime: convertToIST(session.loginTime).format(),
      logoutTime: session.logoutTime ? convertToIST(session.logoutTime).format() : null,
      workTime: session.workTime,
      breakTime: session.breakTime,
      idleTime: session.idletimes || 0,
      breaks: session.breaks.map(breakPeriod => ({
        nameOfBreak: breakPeriod.nameOfBreak,
        startTime: convertToIST(breakPeriod.startTime).format(),
        endTime: breakPeriod.endTime ? convertToIST(breakPeriod.endTime).format() : null,
        duration: breakPeriod.endTime ? moment(breakPeriod.endTime).diff(moment(breakPeriod.startTime), 'minutes') : null
      })),
      breakSummary: calculateBreakSummary(session.breaks)
    }));

    const response = {
      userName: userActivity.user.userName,
      lastLoginTime: userActivity.lastLoginTime ? convertToIST(userActivity.lastLoginTime).format() : null,
      lastLogoutTime: userActivity.lastLogoutTime ? convertToIST(userActivity.lastLogoutTime).format() : null,
      isLoggedIn: userActivity.isLoggedIn,
      sessions: formattedSessions
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user activity", error: error.message });
  }
};
exports.startIdleTime = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    
    const userActivity = await UserActivity.findOne({ user: userId, isLoggedIn: true });
    
    if (!userActivity) {
      return res.status(404).json({ message: "No active session found" });
    }
    
    const currentSession = userActivity.sessions[userActivity.sessions.length - 1];
    
    if (!currentSession.idletime) {
      currentSession.idletime = [];
    }

    currentSession.idletime.push({ startTime: now });
    
    await userActivity.save();
    
    res.status(200).json({ 
      message: "Idle time start recorded successfully", 
      idleStartTime: convertToIST(now).format() 
    });
  } catch (error) {
    console.error("Error in startIdleTime:", error);
    res.status(500).json({ message: "Error recording idle time start", error: error.message });
  }
};

exports.endIdleTime = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    // Find the active session for the user
    const userActivity = await UserActivity.findOne({ user: userId, isLoggedIn: true });

    if (!userActivity) {
      return res.status(404).json({ message: "No active session found" });
    }

    // const currentSession = userActivity.sessions[userActivity.sessions.length - 1];

    const currentSession = userActivity.sessions[userActivity.sessions.length - 1];
    const currentIdleTime = currentSession.idletime[currentSession.idletime.length - 1];


    // Ensure idealtime array exists
    if (!currentIdleTime || currentIdleTime.endTime) {
      return res.status(400).json({ message: "No active idle time found" });
    }

    currentIdleTime.endTime = now;

    await userActivity.save();

    res.status(200).json({
      message: "Idle time end recorded successfully",
      idleEndTime: convertToIST(now).format()
    });
  } catch (error) {
    res.status(500).json({ message: "Error recording idle time end", error: error.message });
  }
};