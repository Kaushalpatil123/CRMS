// third-party
import { FormattedMessage } from 'react-intl';

// assets
import SportsIcon from '@mui/icons-material/Sports';
import {
  KyberNetwork,
  Messages2,
  Calendar1,
  Kanban,
  Profile2User,
  Bill,
  UserSquare,
  ShoppingBag,
  TicketDiscount,
  CallIncoming,
  People,
  BoxTime,
  Card,
  SecurityUser,
  ShoppingCart,
  MessageQuestion,
  Paypal
} from 'iconsax-react';

// icons
const icons = {
  applications: KyberNetwork,
  allcustomer: People,
  chat: Messages2,
  calendar: Calendar1,
  kanban: Kanban,
  customer: Profile2User,
  invoice: Bill,
  profile: UserSquare,
  ecommerce: ShoppingBag,
  coupons: TicketDiscount,
  contact: CallIncoming,
  allorder: ShoppingCart,
  faq: MessageQuestion,
  blogs: Card,
  alladmins: SecurityUser,
  allgrounds: SecurityUser,
  coach: SportsIcon,
  allgrounds: SecurityUser,
  payment: Paypal
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //
const applicationsSchool = {
  id: 'group-applications',
  title: <FormattedMessage id="applications" />,
  icon: icons.applications,
  type: 'group',
  children: [
    // {
    //   id: 'allschools',
    //   title: <FormattedMessage id="All Schools" />,
    //   type: 'item',
    //   url: '/apps/all-schools',
    //   icon: icons.alladmins,
    //   breadcrumbs: false
    // },
    {
      id: 'allStudents',
      title: <FormattedMessage id="All Students" />,
      type: 'item',
      url: '/apps/all-students',
      icon: icons.alladmins
      // breadcrumbs: false
    },
    {
      id: 'subscription-history',
      title: <FormattedMessage id="Subscription History" />,
      type: 'item',
      icon: icons.allcustomer,
      url: '/apps/subscription-history'
    },

    {
      id: 'bookinghistory',
      title: <FormattedMessage id="Booking History" />,
      type: 'item',
      url: '/apps/booking-history',
      icon: icons.payment
      // breadcrumbs: false
    }
  ]
};

let applicationsSuperAdmin = {
  id: 'group-applications',
  title: <FormattedMessage id="applications" />,
  icon: icons.applications,
  type: 'group',
  children: [
    {
      id: 'customer-list',
      title: <FormattedMessage id="All Customers" />,
      type: 'item',
      icon: icons.allcustomer,
      url: '/apps/customer/customer-list',
      breadcrumbs: false
    },

    // {
    //   id: 'faq',
    //   title: <FormattedMessage id="FAQ" />,
    //   type: 'item',
    //   url: '/apps/faq',
    //   icon: icons.faq,
    //   breadcrumbs: false
    // },

    {
      id: 'alladmins',
      title: <FormattedMessage id="All Admins" />,
      type: 'item',
      url: '/apps/alladmins',
      icon: icons.alladmins,
      breadcrumbs: false
    },

    {
      id: 'subscriptions',
      title: <FormattedMessage id="Subscriptions" />,
      type: 'item',
      url: '/apps/subscriptions',
      icon: icons.alladmins,
      breadcrumbs: false
    },

    {
      id: 'sports',
      title: <FormattedMessage id="Sports" />,
      type: 'item',
      url: '/apps/sports',
      icon: icons.alladmins,
      breadcrumbs: false
    },

    {
      id: 'cancel-booking',
      title: <FormattedMessage id="Cancel booking" />,
      type: 'item',
      url: '/apps/cancel-booking',
      icon: icons.alladmins,
      breadcrumbs: false
    },

    {
      id: 'coach-earning',
      title: <FormattedMessage id="Coaches Earning" />,
      type: 'item',
      url: '/apps/coach-earning',
      icon: icons.alladmins,
      breadcrumbs: false
    },
    // Prospects

    // {
    //   id: 'prospects',
    //   title: <FormattedMessage id="Prospects" />,
    //   type: 'collapse',
    //   icon: icons.customer,
    //   children: [
    //     {
    //       id: 'Prospects',
    //       title: <FormattedMessage id="All Prospects" />,
    //       type: 'item',
    //       url: '/apps/prospects',
    //       icon: icons.coach,
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'create-prospects',
    //       title: <FormattedMessage id="Add Prospects" />,
    //       type: 'item',
    //       url: '/apps/create-prospects',
    //       icon: icons.coach,
    //       breadcrumbs: false
    //     }
    //   ]
    // },

    {
      id: 'grounds',
      title: <FormattedMessage id="Grounds" />,
      type: 'collapse',
      icon: icons.customer,
      children: [
        {
          id: 'grounds',
          title: <FormattedMessage id="All Grounds" />,
          type: 'item',
          url: '/apps/grounds',
          icon: icons.coach,
          breadcrumbs: false
        },
        {
          id: 'create-ground',
          title: <FormattedMessage id="Add grounds" />,
          type: 'item',
          url: '/apps/create-grounds',
          icon: icons.coach,
          breadcrumbs: false
        }
      ]
    },

    {
      id: 'coach',
      title: <FormattedMessage id="Coach" />,
      type: 'collapse',
      icon: icons.customer,
      children: [
        {
          id: 'all-coach',
          title: <FormattedMessage id="All Coaches" />,
          type: 'item',
          url: '/apps/coach',
          icon: icons.coach,
          breadcrumbs: false
        },
        {
          id: 'create-coach',
          title: <FormattedMessage id="Add Coach" />,
          type: 'item',
          url: '/apps/create-coach',
          icon: icons.coach,
          breadcrumbs: false
        }
      ]
    },

    // Bookings

    {
      id: 'Bookings',
      title: <FormattedMessage id="Bookings" />,
      type: 'collapse',
      icon: icons.customer,
      children: [
        {
          id: 'ground-booking',
          title: <FormattedMessage id="Ground booking" />,
          type: 'item',
          url: '/apps/ground-booking',
          icon: icons.payment,
          breadcrumbs: false
        },
        {
          id: 'coach-booking',
          title: <FormattedMessage id="Coach booking" />,
          type: 'item',
          url: '/apps/coach-booking',
          icon: icons.payment,
          breadcrumbs: false
        }
      ]
    },

    {
      id: 'Coach Availability',
      title: <FormattedMessage id="Coach Availability" />,
      type: 'collapse',
      icon: icons.customer,
      children: [
        {
          id: 'all-coaches-availability',
          title: <FormattedMessage id="All Coaches Availability" />,
          type: 'item',
          url: '/apps/all-coaches-availability',
          icon: icons.coach,
          breadcrumbs: false
        },

        {
          id: 'create-coach-availability',
          title: <FormattedMessage id="Add Coach Availability" />,
          type: 'item',
          url: '/apps/create-coach-availability',
          icon: icons.coach,
          breadcrumbs: false
        }
      ]
    },

    {
      id: 'schools',
      title: <FormattedMessage id="Schools" />,
      type: 'collapse',
      icon: icons.customer,
      children: [
        {
          id: 'schools',
          title: <FormattedMessage id="All Schools" />,
          type: 'item',
          url: '/apps/schools',
          icon: icons.coach,
          breadcrumbs: false
        },
        {
          id: 'create-schools',
          title: <FormattedMessage id="Add Schools" />,
          type: 'item',
          url: '/apps/create-schools',
          icon: icons.coach,
          breadcrumbs: false
        }
      ]
    },

    // payments
    {
      id: 'payments',
      title: <FormattedMessage id="All payments" />,
      type: 'item',
      url: '/apps/paymenthistory',
      icon: icons.payment,
      breadcrumbs: false
    },
    {
      id: 'Complaints/Queries',
      title: <FormattedMessage id="All Complaints" />,
      type: 'item',
      url: '/apps/allcomplaints',
      icon: icons.payment,
      breadcrumbs: false
    }
  ]
};
let applications = {
  id: 'group-applications',
  title: <FormattedMessage id="applications" />,
  icon: icons.applications,
  type: 'group',
  children: [
    {
      id: 'datatable',
      title: <FormattedMessage id="datatable" />,
      type: 'item',
      url: '/tables/mui-table/datatable',
      icon: icons.chat,
      breadcrumbs: false
    },
    // {
    //   id: 'Contact',
    //   title: <FormattedMessage id="Contact" />,
    //   type: 'item',
    //   url: '/apps/contact',
    //   icon: icons.call,
    //   breadcrumbs: false
    // },

    // {
    //   id: 'calendar',
    //   title: <FormattedMessage id="calendar" />,
    //   type: 'item',
    //   url: '/apps/calendar',
    //   icon: icons.calendar
    // },
    {
      id: 'kanban',
      title: <FormattedMessage id="kanban" />,
      type: 'item',
      icon: icons.kanban,
      url: '/apps/kanban/board'
    },
    {
      id: 'Invoice',
      title: <FormattedMessage id="invoice" />,
      type: 'collapse',
      icon: icons.invoice,
      children: [
        {
          id: 'Invoice-List',
          title: <FormattedMessage id="All Invoice" />,
          type: 'item',
          icon: icons.invoice,
          url: '/apps/invoice/list',
          breadcrumbs: false
        },
        {
          id: 'create-Invoice',
          title: <FormattedMessage id="Create invoice" />,
          type: 'item',
          url: '/apps/invoice/create',
          icon: icons.invoice,
          breadcrumbs: false
        }
      ]
    },
    // {
    //   id: 'customer',
    //   title: <FormattedMessage id="Customer" />,
    //   type: 'collapse',
    //   icon: icons.customer,
    //   children: [
    {
      id: 'customer-list',
      title: <FormattedMessage id="All Customers" />,
      type: 'item',
      icon: icons.allcustomer,
      url: '/apps/customer/customer-list',
      breadcrumbs: false
    },
    // ]
    // },

    {
      id: 'faq',
      title: <FormattedMessage id="FAQ" />,
      type: 'item',
      url: '/apps/faq',
      icon: icons.faq,
      breadcrumbs: false
    },
    {
      id: 'Productlist',
      title: <FormattedMessage id="Productlist" />,
      type: 'item',
      url: '/apps/Productlist',
      icon: icons.Productlist,
      breadcrumbs: false
    },

    {
      id: 'lead',
      title: <FormattedMessage id="Lead" />,
      type: 'item',
      url: '/apps/lead',
      icon: icons.faq,
      breadcrumbs: false
    },

    {
      id: 'purchase',
      title: <FormattedMessage id="Purchase" />,
      type: 'item',
      url: '/apps/purchase',
      icon: icons.faq,
      breadcrumbs: false
    },

    // {
    //   id: 'allorder',
    //   title: <FormattedMessage id="All order" />,
    //   type: 'item',
    //   url: '/apps/allorder',
    //   icon: icons.allorder,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'contactus',
    //   title: <FormattedMessage id="Contact Us" />,
    //   type: 'item',
    //   url: '/apps/contactus',
    //   icon: icons.contact,
    //   breadcrumbs: false
    // },

    // {
    //   id: 'alladmins',
    //   title: <FormattedMessage id="All Admins" />,
    //   type: 'item',
    //   url: '/apps/alladmins',
    //   icon: icons.alladmins,
    //   breadcrumbs: false
    // },

    {
      id: 'subscriptions',
      title: <FormattedMessage id="Subscriptions" />,
      type: 'item',
      url: '/apps/subscriptions',
      icon: icons.alladmins,
      breadcrumbs: false
    },

    {
      id: 'sports',
      title: <FormattedMessage id="Sports" />,
      type: 'item',
      url: '/apps/sports',
      icon: icons.alladmins,
      breadcrumbs: false
    },
    {
      id: 'Quotation',
      title: <FormattedMessage id="Quotation" />,
      type: 'item',
      url: '/apps/quote',
      icon: icons.alladmins,
      breadcrumbs: false
    },
    {
      id: 'Quotation add',
      title: <FormattedMessage id="Quotation add" />,
      type: 'item',
      url: '/apps/Quote/createQuotation',
      icon: icons.alladmins,
      breadcrumbs: false
    },
    {
      id: 'cancel-booking',
      title: <FormattedMessage id="Cancel booking" />,
      type: 'item',
      url: '/apps/cancel-booking',
      icon: icons.alladmins,
      breadcrumbs: false
    },

    {
      id: 'coach-earning',
      title: <FormattedMessage id="Coaches Earning" />,
      type: 'item',
      url: '/apps/coach-earning',
      icon: icons.alladmins,
      breadcrumbs: false
    },

    // {
    //   id: 'slots',
    //   title: <FormattedMessage id="slots" />,
    //   type: 'item',
    //   url: '/apps/slots',
    //   icon: icons.alladmins,
    //   breadcrumbs: false
    // },

    // {
    //   id: 'grounds',
    //   title: <FormattedMessage id="Grounds" />,
    //   type: 'item',
    //   url: '/apps/grounds',
    //   icon: icons.allgrounds,
    //   breadcrumbs: false
    // },
    // Prospects

    {
      id: 'prospects',
      title: <FormattedMessage id="Prospects" />,
      type: 'collapse',
      icon: icons.customer,
      children: [
        {
          id: 'Prospects',
          title: <FormattedMessage id="All Prospects" />,
          type: 'item',
          url: '/apps/prospects',
          icon: icons.coach,
          breadcrumbs: false
        },
        {
          id: 'create-prospects',
          title: <FormattedMessage id="Add Prospects" />,
          type: 'item',
          url: '/apps/create-prospects',
          icon: icons.coach,
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'grounds',
      title: <FormattedMessage id="Grounds" />,
      type: 'collapse',
      icon: icons.customer,
      children: [
        {
          id: 'grounds',
          title: <FormattedMessage id="All Grounds" />,
          type: 'item',
          url: '/apps/grounds',
          icon: icons.coach,
          breadcrumbs: false
        },
        {
          id: 'create-ground',
          title: <FormattedMessage id="Add grounds" />,
          type: 'item',
          url: '/apps/create-grounds',
          icon: icons.coach,
          breadcrumbs: false
        }
      ]
    },

    {
      id: 'coach',
      title: <FormattedMessage id="Coach" />,
      type: 'collapse',
      icon: icons.customer,
      children: [
        {
          id: 'all-coach',
          title: <FormattedMessage id="All Coaches" />,
          type: 'item',
          url: '/apps/coach',
          icon: icons.coach,
          breadcrumbs: false
        },
        {
          id: 'create-coach',
          title: <FormattedMessage id="Add Coach" />,
          type: 'item',
          url: '/apps/create-coach',
          icon: icons.coach,
          breadcrumbs: false
        }

        // {
        //   id: 'coach-availability',
        //   title: <FormattedMessage id="Coach Availability" />,
        //   type: 'item',
        //   url: '/apps/coach-availability',
        //   icon: icons.coach,
        //   breadcrumbs: false
        // }
      ]
    },

    // Bookings

    {
      id: 'Bookings',
      title: <FormattedMessage id="Bookings" />,
      type: 'collapse',
      icon: icons.customer,
      children: [
        {
          id: 'ground-booking',
          title: <FormattedMessage id="Ground booking" />,
          type: 'item',
          url: '/apps/ground-booking',
          icon: icons.payment,
          breadcrumbs: false
        },
        {
          id: 'coach-booking',
          title: <FormattedMessage id="Coach booking" />,
          type: 'item',
          url: '/apps/coach-booking',
          icon: icons.payment,
          breadcrumbs: false
        }
      ]
    },

    {
      id: 'Coach Availability',
      title: <FormattedMessage id="Coach Availability" />,
      type: 'collapse',
      icon: icons.customer,
      children: [
        {
          id: 'all-coaches-availability',
          title: <FormattedMessage id="All Coaches Availability" />,
          type: 'item',
          url: '/apps/all-coaches-availability',
          icon: icons.coach,
          breadcrumbs: false
        },

        {
          id: 'create-coach-availability',
          title: <FormattedMessage id="Add Coach Availability" />,
          type: 'item',
          url: '/apps/create-coach-availability',
          icon: icons.coach,
          breadcrumbs: false
        }
      ]
    },

    // {
    //   id: 'coach',
    //   title: <FormattedMessage id="Coach" />,
    //   type: 'item',
    //   url: '/apps/coach',
    //   icon: icons.coach,
    //   breadcrumbs: false
    // },

    {
      id: 'schools',
      title: <FormattedMessage id="Schools" />,
      type: 'collapse',
      icon: icons.customer,
      children: [
        {
          id: 'schools',
          title: <FormattedMessage id="All Schools" />,
          type: 'item',
          url: '/apps/schools',
          icon: icons.coach,
          breadcrumbs: false
        },
        {
          id: 'create-schools',
          title: <FormattedMessage id="Add Schools" />,
          type: 'item',
          url: '/apps/create-schools',
          icon: icons.coach,
          breadcrumbs: false
        }
      ]
    },

    // {
    //   id: 'schools',
    //   title: <FormattedMessage id="Schools" />,
    //   type: 'item',
    //   url: '/apps/schools',
    //   icon: icons.coach,
    //   breadcrumbs: false
    // },

    // payments
    {
      id: 'payments',
      title: <FormattedMessage id="All payments" />,
      type: 'item',
      url: '/apps/paymenthistory',
      icon: icons.payment,
      breadcrumbs: false
    },
    {
      id: 'Complaints/Queries',
      title: <FormattedMessage id="All Complaints" />,
      type: 'item',
      url: '/apps/allcomplaints',
      icon: icons.payment,
      breadcrumbs: false
    },
    {
      id: 'orders',
      title: <FormattedMessage id="Orders" />,
      type: 'item',
      url: '/apps/orders',
      icon: icons.payment,
      breadcrumbs: false
    }
    // {
    //   id: 'allcoupons',
    //   title: <FormattedMessage id="All Coupons" />,
    //   type: 'item',
    //   url: '/apps/allcoupons',
    //   icon: icons.coupons,
    //   breadcrumbs: false
    // },
    // // {
    // //   id: 'blog',
    // //   title: <FormattedMessage id="Blogs" />,
    // //   type: 'item',
    // //   url: '/apps/blog/Blog',
    // //   icon: icons.blogs
    // // }
  ]
};

const role = localStorage.getItem('role');
if (role === 'school') {
  applications = applicationsSchool;
  console.log('school login');
} else if (role == 'superadmin') {
  applications = applicationsSuperAdmin;
  console.log('superadmin login');
} else {
  applications = applications;
  console.log('default admin login');
}
export default applications;
