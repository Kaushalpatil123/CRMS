//sign-up
/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - Role
 *               - mobile
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               Role:
 *                 type: string
 *               mobile:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     password:
 *                       type: string
 *                       description: Hashed password
 *                     userName:
 *                       type: string
 *                     Role:
 *                       type: string
 *                     mobile:
 *                       type: string
 *                     _id:
 *                       type: string
 *       400:
 *         description: Bad request or User already exists
 *       500:
 *         description: Internal Server Error
 * 
 * /api/user/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: "User logged in successfully"
 *                 role:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Invalid password
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 * 
 * /api/user/getuser:
 *   get:
 *     summary: Get users
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       userName:
 *                         type: string
 *                       Role:
 *                         type: string
 *                       mobile:
 *                         type: string
 *       500:
 *         description: Internal Server Error
 *
 * /api/user/update/{userId}:
 *   put:
 *     summary: Update a user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               Role:
 *                 type: string
 *               mobile:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     userName:
 *                       type: string
 *                     Role:
 *                       type: string
 *                     mobile:
 *                       type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 *
 * /api/user/deleted/{userId}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 *
 * /api/user/user-name:
 *   get:
 *     summary: Get usernames of all users with role "User"
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully retrieved usernames
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Usernames retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Internal Server Error
 *
 * /api/user/password/{userId}:
 *   get:
 *     summary: Decrypt the password of a specific user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Successfully decrypted the password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: "Password decrypted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     email:
 *                       type: string
 *                     Password:
 *                       type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */


//********************************               Lead   ************************************************* 

/**
 * @swagger
 * /api/leads:
 *   post:
 *     summary: Create a new lead
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyName
 *               - contacts
 *               - country
 *               - state
 *               - city
 *               - source
 *             properties:
 *               companyName:
 *                 type: string
 *               contacts:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - firstName
 *                     - lastName
 *                     - email
 *                     - phoneNumber
 *                   properties:
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     phoneNumber:
 *                       type: string
 *                       pattern: '^[0-9]{10}$'
 *                       description: Must be exactly 10 digits
 *               country:
 *                 type: string
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               executive:
 *                 type: string
 *               source:
 *                 type: string
 *               designation:
 *                 type: string
 *                 nullable: true
 *               product:
 *                 type: string
 *                 nullable: true
 *               requirements:
 *                 type: string
 *                 nullable: true
 *               notes:
 *                 type: string
 *                 nullable: true
 *               status:
 *                 type: string
 *                 nullable: true
 *               agentstatus:
 *                 type: string
 *                 enum: ['Available', 'Unavailable / Not Answering', 'Busy', 'Switched Off', 'Not Reachable']
 *                 default: 'Available'
 *               lastInteractions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     executiveName:
 *                       type: string
 *                     date:
 *                       type: string
 *                       format: date
 *                     time:
 *                       type: string
 *                       pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *                       description: Time in HH:MM format
 *                     description:
 *                       type: string
 *               nextInteraction:
 *                 type: object
 *                 nullable: true
 *                 properties:
 *                   executiveName:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   time:
 *                     type: string
 *                     pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *                     description: Time in HH:MM format
 *                   description:
 *                     type: string
 *     responses:
 *       201:
 *         description: Lead created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 66ab8235094c8b7d55ec1617
 *                 companyName:
 *                   type: string
 *                 contacts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phoneNumber:
 *                         type: string
 *                 country:
 *                   type: string
 *                 state:
 *                   type: string
 *                 city:
 *                   type: string
 *                 executive:
 *                   type: string
 *                 source:
 *                   type: string
 *                 designation:
 *                   type: string
 *                   nullable: true
 *                 product:
 *                   type: string
 *                   nullable: true
 *                 requirements:
 *                   type: string
 *                   nullable: true
 *                 notes:
 *                   type: string
 *                   nullable: true
 *                 status:
 *                   type: string
 *                   nullable: true
 *                 agentstatus:
 *                   type: string
 *                   enum: ['Available', 'Unavailable / Not Answering', 'Busy', 'Switched Off', 'Not Reachable']
 *                 lastInteractions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       executiveName:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date
 *                       time:
 *                         type: string
 *                         pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *                       description:
 *                         type: string
 *                 nextInteraction:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     executiveName:
 *                       type: string
 *                     date:
 *                       type: string
 *                       format: date
 *                     time:
 *                       type: string
 *                       pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *                     description:
 *                       type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/leads:
 *   get:
 *     summary: Get leads with optional filtering, pagination, and sorting
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items per page
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering leads (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering leads (YYYY-MM-DD)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter leads by status
 *       - in: query
 *         name: executive
 *         schema:
 *           type: string
 *         description: Filter leads by executive name
 *       - in: query
 *         name: isactive
 *         schema:
 *           type: boolean
 *         description: Filter leads by active status (true/false)
 *       - in: query
 *         name: isWishlist
 *         schema:
 *           type: boolean
 *         description: Filter leads by wishlist status (true/false)
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order for leads within the current page (ascending or descending)
 *     responses:
 *       200:
 *         description: Successfully retrieved leads
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 leads:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       companyName:
 *                         type: string
 *                       contacts:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             firstName:
 *                               type: string
 *                             lastName:
 *                               type: string
 *                             email:
 *                               type: string
 *                             phoneNumber:
 *                               type: string
 *                       country:
 *                         type: string
 *                       state:
 *                         type: string
 *                       city:
 *                         type: string
 *                       executive:
 *                         type: string
 *                       source:
 *                         type: string
 *                       designation:
 *                         type: string
 *                       product:
 *                         type: string
 *                       requirements:
 *                         type: string
 *                       notes:
 *                         type: string
 *                       status:
 *                         type: string
 *                       statusColor:
 *                         type: string
 *                       isactive:
 *                         type: boolean
 *                       lastInteractions:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             executiveName:
 *                               type: string
 *                             date:
 *                               type: string
 *                               format: date
 *                             time:
 *                               type: string
 *                             description:
 *                               type: string
 *                       nextInteraction:
 *                         type: object
 *                         properties:
 *                           executiveName:
 *                             type: string
 *                           date:
 *                             type: string
 *                             format: date
 *                           time:
 *                             type: string
 *                           description:
 *                             type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 currentPage:
 *                   type: integer
 *                   description: The current page number
 *                 pageSize:
 *                   type: integer
 *                   description: The number of items per page
 *                 hasPreviousPage:
 *                   type: boolean
 *                   description: Indicates if there is a previous page
 *                 hasNextPage:
 *                   type: boolean
 *                   description: Indicates if there is a next page
 *                 totalLeads:
 *                   type: integer
 *                   description: The total number of leads matching the query
 *                 sortOrder:
 *                   type: string
 *                   enum: [asc, desc]
 *                   description: The sort order applied to the results
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /api/leads/indiamart-leads:
 *   get:
 *     summary: Get indiamart leads with optional filtering, pagination, and sorting
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items per page
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering leads (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering leads (YYYY-MM-DD)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter leads by status
 *       - in: query
 *         name: executive
 *         schema:
 *           type: string
 *         description: Filter leads by executive name
 *       - in: query
 *         name: isactive
 *         schema:
 *           type: boolean
 *         description: Filter leads by active status (true/false)
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order for leads within the current page (ascending or descending)
 *     responses:
 *       200:
 *         description: Successfully retrieved leads
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 leads:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       companyName:
 *                         type: string
 *                       contacts:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             firstName:
 *                               type: string
 *                             lastName:
 *                               type: string
 *                             email:
 *                               type: string
 *                             phoneNumber:
 *                               type: string
 *                       country:
 *                         type: string
 *                       state:
 *                         type: string
 *                       city:
 *                         type: string
 *                       executive:
 *                         type: string
 *                       source:
 *                         type: string
 *                       designation:
 *                         type: string
 *                       product:
 *                         type: string
 *                       requirements:
 *                         type: string
 *                       notes:
 *                         type: string
 *                       status:
 *                         type: string
 *                       statusColor:
 *                         type: string
 *                       isactive:
 *                         type: boolean
 *                       lastInteractions:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             executiveName:
 *                               type: string
 *                             date:
 *                               type: string
 *                               format: date
 *                             time:
 *                               type: string
 *                             description:
 *                               type: string
 *                       nextInteraction:
 *                         type: object
 *                         properties:
 *                           executiveName:
 *                             type: string
 *                           date:
 *                             type: string
 *                             format: date
 *                           time:
 *                             type: string
 *                           description:
 *                             type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 currentPage:
 *                   type: integer
 *                   description: The current page number
 *                 pageSize:
 *                   type: integer
 *                   description: The number of items per page
 *                 hasPreviousPage:
 *                   type: boolean
 *                   description: Indicates if there is a previous page
 *                 hasNextPage:
 *                   type: boolean
 *                   description: Indicates if there is a next page
 *                 totalLeads:
 *                   type: integer
 *                   description: The total number of leads matching the query
 *                 sortOrder:
 *                   type: string
 *                   enum: [asc, desc]
 *                   description: The sort order applied to the results
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /api/leads/{id}:
 *   get:
 *     summary: Get a single lead by ID
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Lead ID
 *     responses:
 *       200:
 *         description: Lead retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 companyName:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 mobile:
 *                   type: string
 *                 country:
 *                   type: string
 *                 state:
 *                   type: string
 *                 city:
 *                   type: string
 *                 executive:
 *                   type: string
 *                 source:
 *                   type: string
 *                 designation:
 *                   type: string
 *                 product:
 *                   type: string
 *                 requirements:
 *                   type: string
 *                 notes:
 *                   type: string
 *                 status:
 *                   type: string
 *                 lastInteraction:
 *                   type: object
 *                   properties:
 *                     executiveName:
 *                       type: string
 *                     date:
 *                       type: string
 *                       format: date-time
 *                     description:
 *                       type: string
 *                 nextInteraction:
 *                   type: object
 *                   properties:
 *                     executiveName:
 *                       type: string
 *                     date:
 *                       type: string
 *                       format: date-time
 *                     description:
 *                       type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/leads/{id}:
 *   put:
 *     summary: Update a lead by ID
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Lead ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               country:
 *                 type: string
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               executive:
 *                 type: string
 *               source:
 *                 type: string
 *               designation:
 *                 type: string
 *               product:
 *                 type: string
 *               requirements:
 *                 type: string
 *               notes:
 *                 type: string
 *               status:
 *                 type: string
 *               lastInteractions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     executiveName:
 *                       type: string
 *                       description: Optional. If not provided, it will be set to the username from the token.
 *                     date:
 *                       type: string
 *                       format: date
 *                     time:
 *                       type: string
 *                       pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *                       description: Time in HH:MM format
 *                     description:
 *                       type: string
 *               nextInteraction:
 *                 type: object
 *                 properties:
 *                   executiveName:
 *                     type: string
 *                     description: Optional. If not provided, it will be set to the username from the token.
 *                   date:
 *                     type: string
 *                     format: date
 *                   time:
 *                     type: string
 *                     pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *                     description: Time in HH:MM format
 *                   description:
 *                     type: string
 *               isactive:
 *                 type: boolean
 *               reason:
 *                 type: string
 *               deleteContact:
 *                 type: string
 *                 description: MongoDB ID of the contact to delete
 *               addContact:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *                     format: email
 *                   phoneNumber:
 *                     type: string
 *                     pattern: '^[0-9]{10}$'
 *               updateContact:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: MongoDB ID of the contact to update
 *                   contact:
 *                     type: object
 *                     properties:
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       email:
 *                         type: string
 *                         format: email
 *                       phoneNumber:
 *                         type: string
 *                         pattern: '^[0-9]{10}$'
 *     responses:
 *       200:
 *         description: Lead updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 companyName:
 *                   type: string
 *                 contacts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phoneNumber:
 *                         type: string
 *                 country:
 *                   type: string
 *                 state:
 *                   type: string
 *                 city:
 *                   type: string
 *                 executive:
 *                   type: string
 *                 source:
 *                   type: string
 *                 designation:
 *                   type: string
 *                 product:
 *                   type: string
 *                 requirements:
 *                   type: string
 *                 notes:
 *                   type: string
 *                 status:
 *                   type: string
 *                 lastInteractions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       executiveName:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date
 *                       time:
 *                         type: string
 *                         pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *                       description:
 *                         type: string
 *                 nextInteraction:
 *                   type: object
 *                   properties:
 *                     executiveName:
 *                       type: string
 *                     date:
 *                       type: string
 *                       format: date
 *                     time:
 *                       type: string
 *                       pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *                     description:
 *                       type: string
 *                 isactive:
 *                   type: boolean
 *                 reason:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Lead not found or User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/leads/lastInteraction/{id}:
 *   put:
 *     summary: Update the last interaction of a lead
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Lead ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the interaction in DD-MM-YYYY format
 *                 example: "15-09-2023"
 *               time:
 *                 type: string
 *                 pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *                 description: Time of the interaction in HH:MM format
 *                 example: "14:30"
 *               description:
 *                 type: string
 *                 description: Details of the interaction
 *             required:
 *               - date
 *               - time
 *               - description
 *     responses:
 *       200:
 *         description: Last interaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 companyName:
 *                   type: string
 *                 contacts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phoneNumber:
 *                         type: string
 *                 country:
 *                   type: string
 *                 state:
 *                   type: string
 *                 city:
 *                   type: string
 *                 executive:
 *                   type: string
 *                 source:
 *                   type: string
 *                 designation:
 *                   type: string
 *                 product:
 *                   type: string
 *                 requirements:
 *                   type: string
 *                 notes:
 *                   type: string
 *                 status:
 *                   type: string
 *                 lastInteractions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       executiveName:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date
 *                       time:
 *                         type: string
 *                         pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *                       description:
 *                         type: string
 *                 nextInteraction:
 *                   type: object
 *                   properties:
 *                     executiveName:
 *                       type: string
 *                     date:
 *                       type: string
 *                       format: date
 *                     time:
 *                       type: string
 *                       pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *                     description:
 *                       type: string
 *                 isactive:
 *                   type: boolean
 *                 reason:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Lead not found or User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/leads/dashboard/lead-count:
 *   get:
 *     summary: Get lead count for the last several months
 *     tags: [Leads]
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         required: false
 *         description: Number of months to retrieve data for (default is 12)
 *     responses:
 *       200:
 *         description: Successfully retrieved lead count data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: string
 *                     description: Month and year in short format (e.g., "Aug 2024")
 *                   count:
 *                     type: integer
 *                     description: Number of leads for that month
 *             example:
 *               - month: "Aug 2024"
 *                 count: 15
 *               - month: "Jul 2024"
 *                 count: 23
 *               - month: "Jun 2024"
 *                 count: 18
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Period must be between 1 and 12 months"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Internal server error message"
 */

/**
 * @swagger
 * /api/leads/{id}:
 *   delete:
 *     summary: Delete a lead by ID
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Lead ID
 *     responses:
 *       200:
 *         description: Lead deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lead deleted successfully
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/leads/active/{id}:
 *   put:
 *     summary: Update the status of a lead
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Lead ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Optional reason for changing the lead status
 *     responses:
 *       200:
 *         description: Lead status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 lead:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     companyName:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     mobile:
 *                       type: string
 *                     country:
 *                       type: string
 *                     state:
 *                       type: string
 *                     city:
 *                       type: string
 *                     executive:
 *                       type: string
 *                     source:
 *                       type: string
 *                     designation:
 *                       type: string
 *                     product:
 *                       type: string
 *                     requirements:
 *                       type: string
 *                     notes:
 *                       type: string
 *                     lastInteraction:
 *                       type: object
 *                       properties:
 *                         executiveName:
 *                           type: string
 *                         date:
 *                           type: string
 *                           format: date-time
 *                         description:
 *                           type: string
 *                     nextInteraction:
 *                       type: object
 *                       properties:
 *                         executiveName:
 *                           type: string
 *                         date:
 *                           type: string
 *                           format: date-time
 *                         description:
 *                           type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     reason:
 *                       type: string
 *                     isactive:
 *                       type: boolean
 *       404:
 *         description: Lead not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

//import an csv for leads
/**
 * @swagger
 * /api/leads/import:
 *   post:
 *     summary: Import leads from an Excel file
 *     tags: [Leads]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Import process completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Status message
 *                 totalRows:
 *                   type: integer
 *                   description: Total number of rows processed
 *                 savedRows:
 *                   type: integer
 *                   description: Number of rows successfully saved
 *                 failedRows:
 *                   type: integer
 *                   description: Number of rows that failed to import
 *                 validationErrors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of validation errors
 *                 saveErrors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of database save errors
 *       400:
 *         description: Bad request or no file uploaded
 *       500:
 *         description: Internal server error
 */

//export an csv for leads 
/**
 * @swagger
 * /api/leads/export:
 *   get:
 *     summary: Export leads to an Excel file
 *     tags: [Leads]
 *     responses:
 *       200:
 *         description: Excel file containing all leads
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *         headers:
 *           Content-Disposition:
 *             schema:
 *               type: string
 *               example: attachment; filename=leads.xlsx
 *           Content-Type:
 *             schema:
 *               type: string
 *               example: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */

/**
 * @swagger
 * /api/leads/lead-to-prospect/{id}:
 *   post:
 *     summary: Convert a lead to a prospect
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Lead ID
 *     responses:
 *       200:
 *         description: Lead successfully converted to Prospect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lead successfully converted to Prospect
 *                 prospect:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     company:
 *                       type: string
 *                     title:
 *                       type: string
 *                       enum: [Mr., Mrs., Ms.]
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     mobile:
 *                       type: number
 *                     email:
 *                       type: string
 *                     website:
 *                       type: string
 *                     industrySegment:
 *                       type: string
 *                     country:
 *                       type: string
 *                     state:
 *                       type: string
 *                     city:
 *                       type: string
 *                     category:
 *                       type: string
 *                       enum: [Prospect]
 *                     product:
 *                       type: string
 *                     executive:
 *                       type: string
 *                     businessProspectAnnual:
 *                       type: number
 *                     orderTarget:
 *                       type: number
 *                     prospectStage:
 *                       type: string
 *                       enum: [Prospect, Target, Lead, Customer]
 *                     prospectCategory:
 *                       type: string
 *                       enum: [New, Discussion, Samples Given, Estimate Shared, Done]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Lead not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Lead not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /api/leads/lead-wishlist/{id}:
 *   put:
 *     summary: Toggle lead wishlist status by ID
 *     tags: [Leads]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Lead ID
 *     responses:
 *       200:
 *         description: Successfully updated lead wishlist status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Status message indicating if the lead was added or removed from the wishlist
 *                 lead:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     leadId:
 *                       type: string
 *                     companyName:
 *                       type: string
 *                     contacts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                           email:
 *                             type: string
 *                           phoneNumber:
 *                             type: string
 *                     country:
 *                       type: string
 *                     state:
 *                       type: string
 *                     city:
 *                       type: string
 *                     executive:
 *                       type: string
 *                     source:
 *                       type: string
 *                     status:
 *                       type: string
 *                     wishlist:
 *                       type: boolean
 *                       description: Whether the lead is in the wishlist
 *             examples:
 *               added:
 *                 summary: Example response when the lead is added to the wishlist
 *                 value:
 *                   message: Lead added to wishlist successfully
 *                   lead:
 *                     _id: "12345"
 *                     leadId: "lead001"
 *                     companyName: "ABC Corp"
 *                     contacts:
 *                       - firstName: "John"
 *                         lastName: "Doe"
 *                         email: "john.doe@abc.com"
 *                         phoneNumber: "+1234567890"
 *                     country: "USA"
 *                     state: "CA"
 *                     city: "San Francisco"
 *                     executive: "Jane Smith"
 *                     source: "Web"
 *                     status: "New"
 *                     wishlist: true
 *               removed:
 *                 summary: Example response when the lead is removed from the wishlist
 *                 value:
 *                   message: Lead removed from wishlist successfully
 *                   lead:
 *                     _id: "12345"
 *                     leadId: "lead001"
 *                     companyName: "ABC Corp"
 *                     contacts:
 *                       - firstName: "John"
 *                         lastName: "Doe"
 *                         email: "john.doe@abc.com"
 *                         phoneNumber: "+1234567890"
 *                     country: "USA"
 *                     state: "CA"
 *                     city: "San Francisco"
 *                     executive: "Jane Smith"
 *                     source: "Web"
 *                     status: "New"
 *                     wishlist: false
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Internal server error
 */

//*********************************************************     CUSTOMER            ********************************/
// Create Customer
/**
 * @swagger
 * /api/customer:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyName
 *               - firstName
 *               - lastName
 *               - email
 *               - mobile
 *               - country
 *               - state
 *             properties:
 *               companyName:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               mobile:
 *                 type: string
 *               website:
 *                 type: string
 *               industrySegment:
 *                 type: string
 *               country:
 *                 type: string
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               receivables:
 *                 type: number
 *                 format: float
 *               receivablesNotes:
 *                 type: string
 *               businessProspect:
 *                 type: number
 *                 format: float
 *               orderTarget:
 *                 type: number
 *                 format: float
 *               msmeNo:
 *                 type: string
 *               panNo:
 *                 type: string
 *               GSTIN:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 60b5f5f5f5f5f5f5f5f5f5f
 *                 companyName:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 mobile:
 *                   type: string
 *                 website:
 *                   type: string
 *                 industrySegment:
 *                   type: string
 *                 country:
 *                   type: string
 *                 state:
 *                   type: string
 *                 city:
 *                   type: string
 *                 receivables:
 *                   type: number
 *                   format: float
 *                 receivablesNotes:
 *                   type: string
 *                 businessProspect:
 *                   type: number
 *                   format: float
 *                 orderTarget:
 *                   type: number
 *                   format: float
 *                 msmeNo:
 *                   type: string
 *                 panNo:
 *                   type: string
 *                 GSTIN:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request
 */

// Get All Customers
/**
 * @swagger
 * /api/customer:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: A list of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   companyName:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   mobile:
 *                     type: string
 *                   website:
 *                     type: string
 *                   industrySegment:
 *                     type: string
 *                   country:
 *                     type: string
 *                   state:
 *                     type: string
 *                   city:
 *                     type: string
 *                   receivables:
 *                     type: number
 *                     format: float
 *                   receivablesNotes:
 *                     type: string
 *                   businessProspect:
 *                     type: number
 *                     format: float
 *                   orderTarget:
 *                     type: number
 *                     format: float
 *                   msmeNo:
 *                     type: string
 *                   panNo:
 *                     type: string
 *                   GSTIN:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal server error
 */

// Get Customer By ID
/**
 * @swagger
 * /api/customer/{id}:
 *   get:
 *     summary: Get a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 companyName:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 mobile:
 *                   type: string
 *                 website:
 *                   type: string
 *                 industrySegment:
 *                   type: string
 *                 country:
 *                   type: string
 *                 state:
 *                   type: string
 *                 city:
 *                   type: string
 *                 receivables:
 *                   type: number
 *                   format: float
 *                 receivablesNotes:
 *                   type: string
 *                 businessProspect:
 *                   type: number
 *                   format: float
 *                 orderTarget:
 *                   type: number
 *                   format: float
 *                 msmeNo:
 *                   type: string
 *                 panNo:
 *                   type: string
 *                 GSTIN:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */

// Update Customer By ID
/**
 * @swagger
 * /api/customer/{id}:
 *   put:
 *     summary: Update a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               mobile:
 *                 type: string
 *               website:
 *                 type: string
 *               industrySegment:
 *                 type: string
 *               country:
 *                 type: string
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               receivables:
 *                 type: number
 *                 format: float
 *               receivablesNotes:
 *                 type: string
 *               businessProspect:
 *                 type: number
 *                 format: float
 *               orderTarget:
 *                 type: number
 *                 format: float
 *               msmeNo:
 *                 type: string
 *               panNo:
 *                 type: string
 *               GSTIN:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 companyName:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 mobile:
 *                   type: string
 *                 website:
 *                   type: string
 *                 industrySegment:
 *                   type: string
 *                 country:
 *                   type: string
 *                 state:
 *                   type: string
 *                 city:
 *                   type: string
 *                 receivables:
 *                   type: number
 *                   format: float
 *                 receivablesNotes:
 *                   type: string
 *                 businessProspect:
 *                   type: number
 *                   format: float
 *                 orderTarget:
 *                   type: number
 *                   format: float
 *                 msmeNo:
 *                   type: string
 *                 panNo:
 *                   type: string
 *                 GSTIN:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */

// Delete Customer By ID
/**
 * @swagger
 * /api/customer/{id}:
 *   delete:
 *     summary: Delete a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Customer deleted successfully
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/leads/assign-executive:
 *   post:
 *     summary: Assign an executive to an IndiaMART lead
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leadId
 *               - executiveName
 *             properties:
 *               leadId:
 *                 type: string
 *                 description: The ID of the IndiaMART lead to be assigned
 *               executiveName:
 *                 type: string
 *                 description: The name of the executive to be assigned to the lead
 *     responses:
 *       200:
 *         description: Executive assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Executive assigned successfully
 *                 lead:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     leadId:
 *                       type: string
 *                     executive:
 *                       type: string
 *                     source:
 *                       type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       403:
 *         description: Forbidden - User does not have Indiamart role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access forbidden only Indiamart allowed
 *       404:
 *         description: Lead not found or already assigned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Lead not found or already assigned
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

//********************************************************         QUOTATION         ***************************** */

/**
 * @swagger
 * /api/quotation/create-quotation:
 *   post:
 *     summary: Create a new quotation
 *     tags: [Quotations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - customer
 *               - contactPerson
 *               - address
 *               - shippingAddress
 *               - reference
 *               - quotationDate
 *               - dueDate
 *               - ItemList
 *               - bankDetails
 *               - totalAmountBeforeTax
 *               - total
 *               - grandTotal
 *             properties:
 *               customer:
 *                 type: string
 *                 description: The ID of the customer
 *               contactPerson:
 *                 type: string
 *                 description: Name of the contact person
 *               salesCredit:
 *                 type: string
 *                 enum: [Yes, No]
 *                 default: No
 *                 description: Indicates if sales credit is applied
 *               address:
 *                 type: object
 *                 properties:
 *                   address1:
 *                     type: string
 *                   address2:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   country:
 *                     type: string
 *                   pincode:
 *                     type: string
 *                   type:
 *                     type: string
 *                     enum: ['Home','Office','Others']
 *               shippingAddress:
 *                 type: string
 *                 description: Shipping address
 *               reference:
 *                 type: string
 *                 description: Reference number or code for the quotation
 *               quotationDate:
 *                 type: string
 *                 format: date
 *                 description: Date of quotation creation (DD-MM-YYYY)
 *                 example: 31-08-2023
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: Due date for the quotation (DD-MM-YYYY)
 *                 example: 31-08-2023
 *               ItemList:
 *                 type: string
 *                 description: A JSON string representing the list of items
 *                 example: '[{"itemandDescription":"Product A","hsnSac":"123456","quantity":2,"unit":"Piece","rate":100,"discount":10,"taxable":180,"cgst":9,"sgst":9,"amount":198}]'
 *               status:
 *                 type: string
 *                 enum: [Paid, Partially Paid, Overdue, Unpaid]
 *               termsAndConditions:
 *                 type: string
 *                 description: Terms and conditions for the quotation
 *               notes:
 *                 type: string
 *                 description: Additional notes for the quotation
 *               bankDetails:
 *                 type: string
 *                 description: Bank details for payment
 *               GSTIN:
 *                 type: string
 *                 description: Bank details for payment
 *               totalAmountBeforeTax:
 *                 type: number
 *                 description: Total amount before tax
 *               total:
 *                 type: number
 *                 description: Total amount including tax
 *               grandTotal:
 *                 type: number
 *                 description: Grand total after applying discounts and extra charges
 *               addExtraCharges:
 *                 type: string
 *                 description: Additional charges to be added
 *                 example: '[{"itemName":"string","percentage":10,"amount":100}]'
 *               addDiscount:
 *                 type: object
 *                 properties:
 *                   itemName:
 *                     type: string
 *                   percentage:
 *                     type: number
 *                   amount:
 *                     type: number
 *               roundoff:
 *                 type: string
 *               uploadFile:
 *                 type: string
 *                 format: binary
 *                 description: File to be uploaded with the quotation
 *     responses:
 *       200:
 *         description: Quotation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Quotation created successfully
 *                 quotation:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60c72b2f9b1d8a001d62f912
 *                     customer:
 *                       type: string
 *                       example: 60c72b2f9b1d8a001d62f913
 *                     contactPerson:
 *                       type: string
 *                       example: John Doe
 *                     salesCredit:
 *                       type: string
 *                       example: No
 *                     address:
 *                       type: object
 *                       properties:
 *                         address1:
 *                           type: string
 *                           example: 123 Main St
 *                         address2:
 *                           type: string
 *                           example: Suite 100
 *                         city:
 *                           type: string
 *                           example: New York
 *                         state:
 *                           type: string
 *                           example: NY
 *                         country:
 *                           type: string
 *                           example: USA
 *                         pincode:
 *                           type: string
 *                           example: 10001
 *                         type:
 *                           type: string
 *                           example: Home
 *                     shippingAddress:
 *                       type: string
 *                       example: 456 Elm St, City, Country
 *                     reference:
 *                       type: string
 *                       example: REF-001
 *                     quotationDate:
 *                       type: string
 *                       format: date
 *                       example: 31-08-2023
 *                     dueDate:
 *                       type: string
 *                       format: date
 *                       example: 15-09-2023
 *                     ItemList:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           itemandDescription:
 *                             type: string
 *                             example: Product A
 *                           hsnSac:
 *                             type: string
 *                             example: 123456
 *                           quantity:
 *                             type: number
 *                             example: 2
 *                           unit:
 *                             type: string
 *                             example: Piece
 *                           rate:
 *                             type: number
 *                             example: 100
 *                           discount:
 *                             type: number
 *                             example: 10
 *                           taxable:
 *                             type: number
 *                             example: 180
 *                           cgst:
 *                             type: number
 *                             example: 9
 *                           sgst:
 *                             type: number
 *                             example: 9
 *                           amount:
 *                             type: number
 *                             example: 198
 *                     status:
 *                       type: string
 *                       example: Paid
 *                     termsAndConditions:
 *                       type: string
 *                       example: Payment due within 15 days
 *                     notes:
 *                       type: string
 *                       example: Thank you for your business
 *                     bankDetails:
 *                       type: string
 *                       example: {Bank: XYZ Bank, Account: 1234567890}
 *                     totalAmountBeforeTax:
 *                       type: number
 *                       example: 180
 *                     total:
 *                       type: number
 *                       example: 198
 *                     grandTotal:
 *                       type: number
 *                       example: 198
 *                     addExtraCharges:
 *                       type: number
 *                       example: 0
 *                     addDiscount:
 *                       type: number
 *                       example: 0
 *                     uploadFile:
 *                       type: string
 *                       example: https://example.com/uploads/quotation-60c72b2f9b1d8a001d62f912.pdf
 *                     quotationNo:
 *                       type: string
 *                       example: QOUT-1
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User or customer not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/quotation/getAllquotations:
 *   get:
 *     summary: Get all quotations with pagination
 *     tags: [Quotations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         type: integer
 *         default: 1
 *         description: Page number for pagination
 *         required: false
 *       - in: query
 *         name: pageSize
 *         type: integer
 *         default: 10
 *         description: Number of items per page for pagination 
 *         required: false
 *       - in: query
 *         name: startDate
 *         type: string
 *         format: date
 *         description: Start date for filtering quotations (YYYY-MM-DD)
 *         required: false
 *       - in: query
 *         name: endDate
 *         type: string
 *         format: date
 *         description: End date for filtering quotations (YYYY-MM-DD)
 *         required: false
 *       - in: query
 *         name: executive
 *         schema:
 *           type: string
 *         description: Filter quotations by executive name
 *       - in: query
 *         name: isWishlist
 *         schema:
 *           type: boolean
 *         description: Filter quotations by wishlist status (true/false)
 *         required: false
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Paid, Partially Paid, Overdue, Unpaid]
 *         description: Filter quotations by status
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order for quotations (asc/desc)
 *     responses:
 *       200:
 *         description: Quotations fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quotation fetched successfully
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     quotations:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 60c72b2f9b1d8a001d62f912
 *                           customer:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 60c72b2f9b1d8a001d62f913
 *                               name:
 *                                 type: string
 *                                 example: John Doe
 *                               email:
 *                                 type: string
 *                                 example: john.doe@example.com
 *                           contactPerson:
 *                             type: string
 *                             example: Jane Smith
 *                           salesCredit:
 *                             type: string
 *                             example: Yes
 *                           address:
 *                             type: object
 *                             properties:
 *                               address1:
 *                                 type: string
 *                                 example: 123 Main St
 *                               address2:
 *                                 type: string
 *                                 example: Suite 100
 *                               city:
 *                                 type: string
 *                                 example: New York
 *                               state:
 *                                 type: string
 *                                 example: NY
 *                               country:
 *                                 type: string
 *                                 example: USA
 *                               pincode:
 *                                 type: string
 *                                 example: 10001
 *                               type:
 *                                 type: string
 *                                 example: Home
 *                           shippingAddress:
 *                             type: string
 *                             example: 5678 Market St, Springfield, USA
 *                           quotationNo:
 *                             type: string
 *                             example: QOUT-001
 *                           reference:
 *                             type: string
 *                             example: RFQ-2024-05
 *                           quotationDate:
 *                             type: string
 *                             format: date
 *                             example: 2024-08-01
 *                           dueDate:
 *                             type: string
 *                             format: date
 *                             example: 2024-08-15
 *                           ItemList:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 itemandDescription:
 *                                   type: string
 *                                   example: Product A description
 *                                 hsnSac:
 *                                   type: string
 *                                   example: 123456
 *                                 quantity:
 *                                   type: integer
 *                                   example: 100
 *                                 unit:
 *                                   type: string
 *                                   enum: [Piece, Kg, Litre, Meter, Item]
 *                                   example: Piece
 *                                 rate:
 *                                   type: number
 *                                   example: 500.00
 *                                 discount:
 *                                   type: number
 *                                   example: 50.00
 *                                 taxable:
 *                                   type: number
 *                                   example: 450.00
 *                                 cgst:
 *                                   type: number
 *                                   example: 40.50
 *                                 sgst:
 *                                   type: number
 *                                   example: 40.50
 *                                 amount:
 *                                   type: number
 *                                   example: 531.00
 *                           termsAndConditions:
 *                             type: string
 *                             example: All sales are final.
 *                           notes:
 *                             type: string
 *                             example: Please deliver by the due date.
 *                           bankDetails:
 *                             type: string
 *                             example: "ABC Bank, Account No: 123456789."
 *                           totalAmountBeforeTax:
 *                             type: number
 *                             example: 10000.00
 *                           total:
 *                             type: number
 *                             example: 11800.00
 *                           grandTotal:
 *                             type: number
 *                             example: 11800.00
 *                           uploadFile:
 *                             type: file
 *                             example: https://s3.amazonaws.com/yourbucket/filename.pdf
 *                           addExtraCharges:
 *                             type: number
 *                             example: 100.00
 *                           addDiscount:
 *                             type: number
 *                             example: 50.00
 *                           isDeleted:
 *                             type: boolean
 *                             example: false
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *                     hasPreviousPage:
 *                       type: boolean
 *                       example: false
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     totalQuotations:
 *                       type: integer
 *                       example: 50
 *       404:
 *         description: No quotations found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No quotations found
 *                 status:
 *                   type: string
 *                   example: fail
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching quotations
 */


/**
 * @swagger
 * /api/quotation/get-quotation/{id}:
 *   get:
 *     summary: Get a quotation by ID
 *     tags: [Quotations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The quotation ID
 *     responses:
 *       200:
 *         description: Quotation fetched successfully
 *       404:
 *         description: Quotation not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/quotation/update-quotation/{id}:
 *   put:
 *     summary: Update an existing quotation by ID
 *     tags: [Quotations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the quotation to update
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               customer:
 *                 type: string
 *                 description: The ID of the customer
 *               contactPerson:
 *                 type: string
 *                 description: Name of the contact person
 *               salesCredit:
 *                 type: string
 *                 enum: [Yes, No]
 *                 description: Indicates if sales credit is applied
 *               address:
 *                 type: object
 *                 properties:
 *                   address1:
 *                     type: string
 *                   address2:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   country:
 *                     type: string
 *                   pincode:
 *                     type: string
 *                   type:
 *                     type: string
 *                     enum: ['Home','Office','Others']
 *               shippingAddress:
 *                 type: string
 *                 description: Shipping address
 *               reference:
 *                 type: string
 *                 description: Reference number or code for the quotation
 *               quotationDate:
 *                 type: string
 *                 format: date
 *                 description: Date of quotation creation (YYYY-MM-DD)
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: Due date for the quotation (YYYY-MM-DD)
 *               ItemList:
 *                 type: string
 *                 description: A JSON string representing the list of items
 *                 example: '[{"itemandDescription":"Product A","hsnSac":"123456","quantity":2,"unit":"Piece","rate":100,"discount":10,"taxable":180,"cgst":9,"sgst":9,"amount":198}]'
 *               status:
 *                 type: string
 *                 enum: [Paid, Partially Paid, Overdue, Unpaid]
 *                 description: Status of quotation ('Paid', 'Partially Paid', 'Overdue', 'Unpaid')
 *               termsAndConditions:
 *                 type: string
 *                 description: Terms and conditions for the quotation
 *               notes:
 *                 type: string
 *                 description: Additional notes for the quotation
 *               bankDetails:
 *                 type: string
 *                 description: Bank details for payment
 *               GSTIN:
 *                 type: string
 *                 description: GSTIN number 
 *               totalAmountBeforeTax:
 *                 type: number
 *                 description: Total amount before tax
 *               total:
 *                 type: number
 *                 description: Total amount including tax
 *               grandTotal:
 *                 type: number
 *                 description: Grand total after applying discounts and extra charges
 *               addExtraCharges:
 *                 type: string
 *                 description: Additional charges to be added
 *                 example: '[{"itemName":"string","percentage":10,"amount":100}]'
 *               addDiscount:
 *                 type: object
 *                 properties:
 *                   itemName:
 *                     type: string
 *                   percentage:
 *                     type: number
 *                   amount:
 *                     type: number
 *               roundoff:
 *                 type: string
 *               uploadFile:
 *                 type: string
 *                 format: binary
 *                 description: File to be uploaded with the quotation
 *             example:
 *               customer: "60c72b2f9b1d8a001d62f913"
 *               contactPerson: "Jane Smith"
 *               salesCredit: "Yes"
 *               address: "789 Broadway, City, Country"
 *               shippingAddress: "321 Oak St, City, Country"
 *               reference: "REF-002"
 *               quotationDate: "2024-01-15"
 *               dueDate: "2024-02-15"
 *               ItemList: '[{"itemandDescription":"Product B","hsnSac":"654321","quantity":5,"unit":"Kg","rate":200,"discount":20,"taxable":980,"cgst":49,"sgst":49,"amount":1078}]'
 *               termsAndConditions: "Payment due within 30 days"
 *               notes: "Urgent delivery required"
 *               bankDetails: "6703a5451a519ce46da105d8"
 *               totalAmountBeforeTax: 980
 *               total: 1078
 *               grandTotal: 1078
 *               addExtraCharges: '[{"itemName":"string","percentage":10,"amount":100}]'
 *               addDiscount: '{"itemName":"string","percentage":10,"amount":100}'
 *     responses:
 *       200:
 *         description: Quotation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Quotation created successfully
 *                 quotation:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60c72b2f9b1d8a001d62f912
 *                     customer:
 *                       type: string
 *                       example: 60c72b2f9b1d8a001d62f913
 *                     contactPerson:
 *                       type: string
 *                       example: John Doe
 *                     salesCredit:
 *                       type: string
 *                       example: No
 *                     address:
 *                       type: object
 *                       properties:
 *                         address1:
 *                           type: string
 *                           example: 123 Main St
 *                         address2:
 *                           type: string
 *                           example: Suite 100
 *                         city:
 *                           type: string
 *                           example: New York
 *                         state:
 *                           type: string
 *                           example: NY
 *                         country:
 *                           type: string
 *                           example: USA
 *                         pincode:
 *                           type: string
 *                           example: 10001
 *                         type:
 *                           type: string
 *                           example: Home
 *                     shippingAddress:
 *                       type: string
 *                       example: 456 Elm St, City, Country
 *                     reference:
 *                       type: string
 *                       example: REF-001
 *                     quotationDate:
 *                       type: string
 *                       format: date
 *                       example: 31-08-2023
 *                     dueDate:
 *                       type: string
 *                       format: date
 *                       example: 15-09-2023
 *                     ItemList:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           itemandDescription:
 *                             type: string
 *                             example: Product A
 *                           hsnSac:
 *                             type: string
 *                             example: 123456
 *                           quantity:
 *                             type: number
 *                             example: 2
 *                           unit:
 *                             type: string
 *                             example: Piece
 *                           rate:
 *                             type: number
 *                             example: 100
 *                           discount:
 *                             type: number
 *                             example: 10
 *                           taxable:
 *                             type: number
 *                             example: 180
 *                           cgst:
 *                             type: number
 *                             example: 9
 *                           sgst:
 *                             type: number
 *                             example: 9
 *                           amount:
 *                             type: number
 *                             example: 198
 *                     status:
 *                       type: string
 *                       example: Paid
 *                     termsAndConditions:
 *                       type: string
 *                       example: Payment due within 15 days
 *                     notes:
 *                       type: string
 *                       example: Thank you for your business
 *                     bankDetails:
 *                       type: string
 *                       example: {Bank: XYZ Bank, Account: 1234567890}
 *                     totalAmountBeforeTax:
 *                       type: number
 *                       example: 180
 *                     total:
 *                       type: number
 *                       example: 198
 *                     grandTotal:
 *                       type: number
 *                       example: 198
 *                     addExtraCharges:
 *                       type: number
 *                       example: 0
 *                     addDiscount:
 *                       type: number
 *                       example: 0
 *                     uploadFile:
 *                       type: string
 *                       example: https://example.com/uploads/quotation-60c72b2f9b1d8a001d62f912.pdf
 *                     quotationNo:
 *                       type: string
 *                       example: QOUT-1
 *       400:
 *         description: Bad request - Validation errors or upload failure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error message describing what went wrong"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access"
 *       404:
 *         description: Quotation not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quotation not found"
 *                 status:
 *                   type: string
 *                   example: fail
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */




/** 
 
 * @swagger
 * /api/quotation/delete-quotation/{id}:
 *   delete:
 *     summary: Delete a quotation by ID
 *     tags: [Quotations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The quotation ID
 *     responses:
 *       200:
 *         description: Quotation deleted successfully
 *       404:
 *         description: Quotation not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/quotation/get-customer-quotation/{id}:
 *   get:
 *     summary: Get quotations for a specific customer by ID
 *     tags: [Quotations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the customer
 *     responses:
 *       200:
 *         description: Quotations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Quotation fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     quotations:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 60b5f5f5f5f5f5f5f5f5f5f
 *                           customer:
 *                             type: string
 *                             example: 60b5f5f5f5f5f5f5f5f5f5f
 *                           contactPerson:
 *                             type: string
 *                             example: John Doe
 *                           totalAmountBeforeTax:
 *                             type: number
 *                             format: float
 *                             example: 5000.00
 *                           total:
 *                             type: number
 *                             format: float
 *                             example: 5500.00
 *                           grandTotal:
 *                             type: number
 *                             format: float
 *                             example: 6000.00
 *                           quotationDate:
 *                             type: string
 *                             format: date
 *                             example: 2023-08-23
 *                           dueDate:
 *                             type: string
 *                             format: date
 *                             example: 2023-09-23
 *                     totalQuotation:
 *                       type: integer
 *                       example: 2
 *       404:
 *         description: Quotation not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quotation not found
 *                 status:
 *                   type: string
 *                   example: fail
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */


/**
 * @swagger
 * /api/quotation/clone/{id}:
 *   post:
 *     summary: Clone an existing quotation by ID
 *     tags: [Quotations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the quotation to be cloned
 *     responses:
 *       201:
 *         description: Quotation cloned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quotation cloned successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64d0c4f3e89f5b23ac6d7fb2
 *                     quotationNo:
 *                       type: string
 *                       example: QOUT-101
 *                     customer:
 *                       type: string
 *                       example: John Doe
 *                     contactPerson:
 *                       type: string
 *                       example: Jane Doe
 *                     salesCredit:
 *                       type: string
 *                       example: No
 *                     address:
 *                       type: object
 *                       properties:
 *                         address1:
 *                           type: string
 *                           example: 123 Main St
 *                         address2:
 *                           type: string
 *                           example: Suite 100
 *                         city:
 *                           type: string
 *                           example: New York
 *                         state:
 *                           type: string
 *                           example: NY
 *                         country:
 *                           type: string
 *                           example: USA
 *                         pincode:
 *                           type: string
 *                           example: 10001
 *                         type:
 *                           type: string
 *                           example: Home
 *                     shippingAddress:
 *                       type: string
 *                       example: 456 Market St, City, State
 *                     reference:
 *                       type: string
 *                       example: REF12345
 *                     quotationDate:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-09-03T14:48:00.000Z
 *                     dueDate:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-09-10T14:48:00.000Z
 *                     ItemList:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           itemandDescription:
 *                             type: string
 *                             example: "Product 1"
 *                           hsnSac:
 *                             type: string
 *                             example: "HSN1234"
 *                           quantity:
 *                             type: number
 *                             example: 10
 *                           unit:
 *                             type: string
 *                             example: "pcs"
 *                           rate:
 *                             type: number
 *                             example: 100.00
 *                           discount:
 *                             type: number
 *                             example: 5.00
 *                           taxable:
 *                             type: number
 *                             example: 950.00
 *                           cgst:
 *                             type: number
 *                             example: 47.50
 *                           sgst:
 *                             type: number
 *                             example: 47.50
 *                           amount:
 *                             type: number
 *                             example: 1045.00
 *                     termsAndConditions:
 *                       type: string
 *                       example: "Standard terms apply."
 *                     notes:
 *                       type: string
 *                       example: "Please deliver as soon as possible."
 *                     bankDetails:
 *                       type: string
 *                       example: "Bank XYZ, Account No: 123456789"
 *                     totalAmountBeforeTax:
 *                       type: number
 *                       example: 1000.00
 *                     total:
 *                       type: number
 *                       example: 1100.00
 *                     grandTotal:
 *                       type: number
 *                       example: 1100.00
 *                     addExtraCharges:
 *                       type: number
 *                       example: 0.00
 *                     addDiscount:
 *                       type: number
 *                       example: 0.00
 *                     isDeleted:
 *                       type: boolean
 *                       example: false
 *                     reason:
 *                       type: string
 *                       example: ""
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error message describing what went wrong"
 *       404:
 *         description: Quotation not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Quotation not found
 */


/**
 * @swagger
 * /api/quotation/exportquotation:
 *   get:
 *     summary: Export quotations to an Excel file
 *     tags: [Quotations]
 *     responses:
 *       200:
 *         description: Excel file containing all quotations
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *         headers:
 *           Content-Disposition:
 *             schema:
 *               type: string
 *               example: attachment; filename=quotations.xlsx
 *           Content-Type:
 *             schema:
 *               type: string
 *               example: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */


/**
 * @swagger
 * /api/quotation/quotation-wishlist/{id}:
 *   put:
 *     summary: Toggle Quotation wishlist status by ID
 *     tags: [Quotations]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Quotation ID
 *     responses:
 *       200:
 *         description: Successfully updated quotation wishlist status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Status message indicating if the quotation was added or removed from the wishlist
 *                 quotation:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     customer:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         firstName:
 *                           type: string
 *                         lastName:
 *                           type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         userName:
 *                           type: string
 *                     contactPerson:
 *                       type: string
 *                     salesCredit:
 *                       type: string
 *                       enum: [Yes, No]
 *                     address:
 *                       type: object
 *                       properties:
 *                         address1:
 *                           type: string
 *                           example: 123 Main St
 *                         address2:
 *                           type: string
 *                           example: Suite 100
 *                         city:
 *                           type: string
 *                           example: New York
 *                         state:
 *                           type: string
 *                           example: NY
 *                         country:
 *                           type: string
 *                           example: USA
 *                         pincode:
 *                           type: string
 *                           example: 10001
 *                         type:
 *                           type: string
 *                           example: Home
 *                     shippingAddress:
 *                       type: string
 *                     reference:
 *                       type: string
 *                     quotationDate:
 *                       type: string
 *                       format: date-time
 *                     dueDate:
 *                       type: string
 *                       format: date-time
 *                     ItemList:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           itemandDescription:
 *                             type: string
 *                           hsnSac:
 *                             type: string
 *                           quantity:
 *                             type: number
 *                           unit:
 *                             type: string
 *                           rate:
 *                             type: number
 *                           discount:
 *                             type: number
 *                           taxable:
 *                             type: number
 *                           cgst:
 *                             type: number
 *                           sgst:
 *                             type: number
 *                           amount:
 *                             type: number
 *                     status:
 *                       type: string
 *                     termsAndConditions:
 *                       type: string
 *                     notes:
 *                       type: string
 *                     bankDetails:
 *                       type: string
 *                     totalAmountBeforeTax:
 *                       type: number
 *                     total:
 *                       type: number
 *                     grandTotal:
 *                       type: number
 *                     uploadFile:
 *                       type: string
 *                     addExtraCharges:
 *                       type: number
 *                     addDiscount:
 *                       type: number
 *                     isDeleted:
 *                       type: boolean
 *                     updatedId:
 *                       type: string
 *                     quotationNo:
 *                       type: string
 *                     wishlist:
 *                       type: boolean
 *             examples:
 *               added:
 *                 summary: Example response when the quotation is added to the wishlist
 *                 value:
 *                   message: Quotation added to wishlist successfully
 *                   quotation:
 *                     _id: "12345"
 *                     customer:
 *                       _id: "customer001"
 *                       firstName: "John"
 *                       lastName: "Doe"
 *                     user:
 *                       _id: "user001"
 *                       userName: "Harsh"
 *                     contactPerson: "Jane Doe"
 *                     salesCredit: "No"
 *                     address:
 *                       type: object
 *                       properties:
 *                         address1:
 *                           type: string
 *                           example: 123 Main St
 *                         address2:
 *                           type: string
 *                           example: Suite 100
 *                         city:
 *                           type: string
 *                           example: New York
 *                         state:
 *                           type: string
 *                           example: NY
 *                         country:
 *                           type: string
 *                           example: USA
 *                         pincode:
 *                           type: string
 *                           example: 10001
 *                         type:
 *                           type: string
 *                           example: Home
 *                     shippingAddress: "456 Shipping Rd"
 *                     reference: "Ref001"
 *                     quotationDate: "2024-09-15T18:30:00.000Z"
 *                     dueDate: "2024-10-15T18:30:00.000Z"
 *                     ItemList:
 *                       - itemandDescription: "Item A"
 *                         hsnSac: "1234"
 *                         quantity: 10
 *                         unit: "pcs"
 *                         rate: 100
 *                         discount: 5
 *                         taxable: 950
 *                         cgst: 9
 *                         sgst: 10
 *                         amount: 200
 *                     status: "Paid"
 *                     termsAndConditions: "Standard terms"
 *                     notes: "Notes"
 *                     bankDetails: "SBI"
 *                     totalAmountBeforeTax: 5000
 *                     total: 5000
 *                     grandTotal: 7000
 *                     uploadFile: "http://res.cloudinary.com/dplajhiuk/image/upload/v1726581290/lfaas5ybe2qgeqak0roz.jpg"
 *                     addExtraCharges: 500
 *                     addDiscount: 235
 *                     wishlist: true
 *               removed:
 *                 summary: Example response when the quotation is removed from the wishlist
 *                 value:
 *                   message: Quotation removed from wishlist successfully
 *                   quotation:
 *                     _id: "12345"
 *                     customer:
 *                       _id: "customer001"
 *                       firstName: "John"
 *                       lastName: "Doe"
 *                     user:
 *                       _id: "user001"
 *                       userName: "Harsh"
 *                     contactPerson: "Jane Doe"
 *                     salesCredit: "No"
 *                     address:
 *                       type: object
 *                       properties:
 *                         address1:
 *                           type: string
 *                           example: 123 Main St
 *                         address2:
 *                           type: string
 *                           example: Suite 100
 *                         city:
 *                           type: string
 *                           example: New York
 *                         state:
 *                           type: string
 *                           example: NY
 *                         country:
 *                           type: string
 *                           example: USA
 *                         pincode:
 *                           type: string
 *                           example: 10001
 *                     shippingAddress: "456 Shipping Rd"
 *                     reference: "Ref001"
 *                     quotationDate: "2024-09-15T18:30:00.000Z"
 *                     dueDate: "2024-10-15T18:30:00.000Z"
 *                     ItemList:
 *                       - itemandDescription: "Item A"
 *                         hsnSac: "1234"
 *                         quantity: 10
 *                         unit: "pcs"
 *                         rate: 100
 *                         discount: 5
 *                         taxable: 950
 *                         cgst: 9
 *                         sgst: 10
 *                         amount: 200
 *                     status: "Paid"
 *                     termsAndConditions: "Standard terms"
 *                     notes: "Notes"
 *                     bankDetails: "SBI"
 *                     totalAmountBeforeTax: 5000
 *                     total: 5000
 *                     grandTotal: 7000
 *                     uploadFile: "http://res.cloudinary.com/dplajhiuk/image/upload/v1726581290/lfaas5ybe2qgeqak0roz.jpg"
 *                     addExtraCharges: 500
 *                     addDiscount: 235
 *                     wishlist: false
 *       404:
 *         description: Quotation not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/quotation/download/{id}:
 *   get:
 *     summary: Download a Quotation as a PDF by ID
 *     tags: [Quotations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Quotation ID
 *     responses:
 *       200:
 *         description: PDF generated successfully
 *         headers:
 *           Content-Disposition:
 *             description: Header to specify the download filename
 *             schema:
 *               type: string
 *               example: attachment; filename=quotation-{id}.pdf
 *           X-Status-Message:
 *             description: Status message of the PDF generation
 *             schema:
 *               type: string
 *               example: PDF generated successfully
 *           X-Status-Code:
 *             description: HTTP Status code of the response
 *             schema:
 *               type: integer
 *               example: 200
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Quotation not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Quotation not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred while generating the PDF.
 */


//********************************************************         product         ***************************** */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - itemname
 *       properties:
 *         itemname:
 *           type: string
 *           description: The name of the product
 *         description:
 *           type: string
 *           description: Product description
 *         hsn:
 *           type: string
 *           description: HSN code
 *         gst:
 *           type: number
 *           description: GST percentage
 *         code:
 *           type: string
 *           description: Product code
 *         category:
 *           type: string
 *           description: Product category
 *         subcategory:
 *           type: string
 *           description: Product subcategory
 *         actualprice:
 *           type: string
 *           description: Actual price of the product
 *         sellingprice:
 *           type: string
 *           description: Selling price of the product
 *         isdeleted:
 *           type: boolean
 *           description: Soft delete flag
 *     ProductInput:
 *       type: object
 *       required:
 *         - itemname
 *       properties:
 *         itemname:
 *           type: string
 *         description:
 *           type: string
 *         hsn:
 *           type: string
 *         gst:
 *           type: number
 *         code:
 *           type: string
 *         category:
 *           type: string
 *         subcategory:
 *           type: string
 *         actualprice:
 *           type: string
 *         sellingprice:
 *           type: string
 */

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Retrieve all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number to retrieve.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: The number of items per page.
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  products:
 *                       type: array
 *                       items:
 *                          $ref: '#/components/schemas/Product'
 *                  currentPage:
 *                       type: integer
 *                       description: The current page number.
 *                  pageSize:
 *                       type: integer
 *                       description: The number of items per page.
 *                  hasPreviousPage:
 *                       type: boolean
 *                       description: Whether there is a previous page.
 *                  hasNextPage:
 *                       type: boolean
 *                       description: Whether there is a next page.
 *                  totalProducts:
 *                       type: integer
 *                       description: The total number of products available.
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: The product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: The product was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary:  delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */



//********************************************************         prospect        ***************************** */

/**
 * @swagger
 * /api/prospect/create-prospect:
 *   post:
 *     summary: Create a new prospect
 *     tags: [Prospects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProspectInput'
 *     responses:
 *       201:
 *         description: Prospect created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProspectResponse'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 * 
 * /api/prospect/getAllProspects:
 *   get:
 *     summary: Get all prospects
 *     tags: [Prospects]
 *     parameters:
 *       - in: query
 *         name: prospectStage
 *         schema:
 *           type: string
 *           enum: [New, Discussion, Samples Given, Estimate Shared, Done]
 *         description: Filter prospects by stage
 *     responses:
 *       200:
 *         description: Prospects fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 length:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Prospect'
 *       500:
 *         description: Internal server error
 *
 * /api/prospect/get-prospect/{id}:
 *   get:
 *     summary: Get a prospect by ID
 *     tags: [Prospects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The prospect ID
 *     responses:
 *       200:
 *         description: Prospect fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProspectResponse'
 *       404:
 *         description: Prospect not found
 *       500:
 *         description: Internal server error
 *
 * /api/prospect/update-prospect/{id}:
 *   put:
 *     summary: Update a prospect by ID
 *     tags: [Prospects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The prospect ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProspectUpdateInput'
 *     responses:
 *       200:
 *         description: Prospect updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProspectResponse'
 *       404:
 *         description: Prospect not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *
 * /api/prospect/delete-prospect/{id}:
 *   delete:
 *     summary: Delete a prospect by ID
 *     tags: [Prospects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The prospect ID
 *     responses:
 *       200:
 *         description: Prospect deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Prospect not found
 *       500:
 *         description: Internal server error
 *
 * /api/prospect/update/{id}/stage:
 *   put:
 *     summary: Update the prospect stage by ID
 *     tags: [Prospects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The prospect ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prospectStage:
 *                 type: string
 *                 enum: [New, Discussion, Samples Given, Estimate Shared, Done]
 *     responses:
 *       200:
 *         description: Prospect stage updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProspectResponse'
 *       400:
 *         description: Bad request - Invalid stage
 *       404:
 *         description: Prospect not found
 *       500:
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     InteractionInput:
 *       type: object
 *       required:
 *         - executiveName
 *         - date
 *         - time
 *         - description
 *       properties:
 *         executiveName:
 *           type: string
 *         date:
 *           type: string
 *           pattern: '^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-\d{4}$'
 *           description: Date in dd-mm-yyyy format
 *         time:
 *           type: string
 *         description:
 *           type: string
 *
 *     ProspectInput:
 *       type: object
 *       required:
 *         - company
 *         - title
 *         - firstName
 *         - lastName
 *         - mobile
 *         - email
 *         - country
 *         - state
 *         - product
 *         - executive
 *         - requirement
 *       properties:
 *         company:
 *           type: string
 *         title:
 *           type: string
 *           enum: [Mr., Mrs., Ms.]
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         mobile:
 *           type: string
 *           pattern: '^[0-9]{10}$'
 *         email:
 *           type: string
 *           format: email
 *         website:
 *           type: string
 *         industrySegment:
 *           type: string
 *         country:
 *           type: string
 *         state:
 *           type: string
 *         city:
 *           type: string
 *         address1:
 *           type: string
 *         address2:
 *           type: string
 *         category:
 *           type: string
 *           enum: [Customer, Prospect, Supplier]
 *           default: Prospect
 *         product:
 *           type: string
 *         executive:
 *           type: string
 *         status:
 *           type: string
 *         requirement:
 *           type: string
 *         businessProspectAnnual:
 *           type: number
 *         orderTarget:
 *           type: number
 *         receivables:
 *           type: number
 *         receivablesnotes:
 *           type: string
 *         msmenumber:
 *           type: string
 *         pannumber:
 *           type: string
 *         lastInteractions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/InteractionInput'
 *         nextInteraction:
 *           $ref: '#/components/schemas/InteractionInput'
 *         prospectStage:
 *           type: string
 *           enum: [New, Discussion, Samples Given, Estimate Shared, Done]
 *           default: New
 *         new:
 *           type: boolean
 *           default: true
 *         samplegiven:
 *           type: boolean
 *           default: false
 *         discussion:
 *           type: string
 *         closedate:
 *           type: string
 *           pattern: '^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-\d{4}$'
 *           description: Close date in dd-mm-yyyy format
 *
 *     ProspectUpdateInput:
 *       type: object
 *       properties:
 *         company:
 *           type: string
 *         title:
 *           type: string
 *           enum: [Mr., Mrs., Ms.]
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         mobile:
 *           type: string
 *           pattern: '^[0-9]{10}$'
 *         email:
 *           type: string
 *           format: email
 *         website:
 *           type: string
 *         industrySegment:
 *           type: string
 *         country:
 *           type: string
 *         state:
 *           type: string
 *         city:
 *           type: string
 *         address1:
 *           type: string
 *         address2:
 *           type: string
 *         category:
 *           type: string
 *           enum: [Customer, Prospect, Supplier]
 *         product:
 *           type: string
 *         executive:
 *           type: string
 *         status:
 *           type: string
 *         requirement:
 *           type: string
 *         businessProspectAnnual:
 *           type: number
 *         orderTarget:
 *           type: number
 *         receivables:
 *           type: number
 *         receivablesnotes:
 *           type: string
 *         msmenumber:
 *           type: string
 *         pannumber:
 *           type: string
 *         lastInteractions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/InteractionInput'
 *         nextInteraction:
 *           $ref: '#/components/schemas/InteractionInput'
 *         prospectStage:
 *           type: string
 *           enum: [New, Discussion, Samples Given, Estimate Shared, Done]
 *         new:
 *           type: boolean
 *         samplegiven:
 *           type: boolean
 *         discussion:
 *           type: string
 *         closedate:
 *           type: string
 *           pattern: '^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-\d{4}$'
 *           description: Close date in dd-mm-yyyy format
 *
 *     Prospect:
 *       allOf:
 *         - $ref: '#/components/schemas/ProspectInput'
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *             createdAt:
 *               type: string
 *               format: date-time
 *             updatedAt:
 *               type: string
 *               format: date-time
 *
 *     ProspectResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/Prospect'
 */

/**
 * @swagger
 * /api/prospect/import:
 *   post:
 *     summary: Import prospects from an Excel file
 *     tags: [Prospects]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Excel file containing prospect data
 *     responses:
 *       200:
 *         description: Import process completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 totalRows:
 *                   type: number
 *                 savedRows:
 *                   type: number
 *                 failedRows:
 *                   type: number
 *                 validationErrors:
 *                   type: array
 *                   items:
 *                     type: string
 *                 saveErrors:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 * 
 * /api/prospect/export:
 *   get:
 *     summary: Export prospects to an Excel file
 *     tags: [Prospects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Excel file containing all prospects
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */

//**************************************** categrory ****************************************************/

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Subcategory:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the subcategory
 *         name:
 *           type: string
 *           description: The name of the subcategory
 *         description:
 *           type: string
 *           description: Subcategory description
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the category
 *         name:
 *           type: string
 *           description: The name of the category
 *         description:
 *           type: string
 *           description: Category description
 *         subcategories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Subcategory'
 *           description: List of subcategories
 *     CategoryInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     SubcategoryInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

/**
 * @swagger
 * /api/category:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: The category was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid input (e.g., duplicate category name)
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Retrieve all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/category/{categoryId}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       200:
 *         description: The category was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid input (e.g., duplicate category name)
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: The category was deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/category/{categoryId}/subcategory:
 *   get:
 *     summary: Retrieve all subcategories for a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: A list of subcategories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subcategory'
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Add a new subcategory to a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubcategoryInput'
 *     responses:
 *       201:
 *         description: The subcategory was successfully added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/category/{categoryId}/subcategory/{subcategoryId}:
 *   put:
 *     summary: Update a subcategory
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *       - in: path
 *         name: subcategoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The subcategory ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubcategoryInput'
 *     responses:
 *       200:
 *         description: The subcategory was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Category or subcategory not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete a subcategory
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *       - in: path
 *         name: subcategoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The subcategory ID
 *     responses:
 *       200:
 *         description: The subcategory was deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category or subcategory not found
 *       500:
 *         description: Server error
 */

//************************************************* Status ********************************************************* */

/**
 * @swagger
 * tags:
 *   name: Status
 *   description: Status management
 */

/**
 * @swagger
 * /api/status/create-status:
 *   post:
 *     summary: Create a new status
 *     tags: [Status]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *               - role
 *             properties:
 *               status:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Lead, Prospect, Invoice, Quotation, Order, Purchase]
 *               color:
 *                 type: string
 *     responses:
 *       201:
 *         description: Status created successfully
 *       400:
 *         description: Bad request or status already exists for this role
 */

/**
 * @swagger
 * /api/status/all-status:
 *   get:
 *     summary: Retrieve all statuses
 *     tags: [Status]
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter statuses by role (optional)
 *     responses:
 *       200:
 *         description: List of all statuses
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/status/status/{id}:
 *   get:
 *     summary: Get a status by ID
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status details
 *       404:
 *         description: Status not found
 */

/**
 * @swagger
 * /api/status/deleted/{id}:
 *   delete:
 *     summary: Delete a status
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status deleted successfully
 *       404:
 *         description: Status not found
 */

/**
 * @swagger
 * /api/status/update/{id}:
 *   put:
 *     summary: Update a status
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Lead, Prospect, Invoice, Quotation, Order, Purchase]
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Bad request or status already exists for this role
 *       404:
 *         description: Status not found
 */


//==================================================        INVOICE         ========================================================

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: API for managing invoices
 */

/**
 * @swagger
 * /api/invoice:
 *   post:
 *     summary: Create a new invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Invoice data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Invoice'
 *     responses:
 *       201:
 *         description: Invoice created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 */

/**
 * @swagger
 * /api/invoice:
 *   get:
 *     summary: Get all invoices
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of invoices per page
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering invoices
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering invoices
 *       - in: query
 *         name: executive
 *         schema:
 *           type: string
 *         description: Filter invoices by executive name
 *       - in: query
 *         name: isWishlist
 *         schema:
 *           type: boolean
 *         description: Filter invoices by wishlist status (true/false)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ['Paid', 'Partially Paid', 'Overdue', 'Unpaid']
 *         description: Filter Invoices by status ('Paid', 'Partially Paid', 'Overdue', 'Unpaid')
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order for leads within the current page (ascending or descending)
 *     responses:
 *       200:
 *         description: List of invoices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 invoices:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Invoice'
 *                 currentPage:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 hasPreviousPage:
 *                   type: boolean
 *                 hasNextPage:
 *                   type: boolean
 *                 totalInvoices:
 *                   type: integer
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/invoice/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     tags: [Invoices]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Invoice ID
 *     responses:
 *       200:
 *         description: Invoice details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Internal Server Error
 */


/**
 * @swagger
 *  /api/invoice/{id}:
 *   put:
 *     summary: Update an invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Invoice ID
 *     requestBody:
 *       description: Invoice data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Invoice'
 *     responses:
 *       200:
 *         description: Invoice updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Invoice not found
 */

/**
 * @swagger
 * /api/invoice/{id}:
 *   delete:
 *     summary: Delete an invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Invoice ID
 *     responses:
 *       200:
 *         description: Invoice deleted successfully
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/invoice/invoices/customer/{customerId}:
 *   get:
 *     summary: Get invoices by customer
 *     tags: [Invoices]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: List of invoices for the specified customer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Invoice'
 *       404:
 *         description: No invoices found for the customer
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/invoice/export/invoice:
 *   get:
 *     summary: Export invoices to Excel
 *     tags: [Invoices]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Invoice export file
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/invoice/cloneinvoice/{id}:
 *   post:
 *     summary: Clone an invoice
 *     tags: [Invoices]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Invoice ID to clone
 *     responses:
 *       201:
 *         description: Invoice cloned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Invoice:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: ['party invoice', 'cash memo']
 *         customer:
 *           type: string
 *         copyFrom:
 *           type: string
 *         partyDetails:
 *           type: object
 *           properties:
 *             contactPerson:
 *               type: string
 *             billingAddress:
 *               type: string
 *             salesCredit:
 *               type: number
 *             shippingAddress:
 *               type: string
 *             shippingDetails:
 *               type: string
 *         documentDetails:
 *           type: object
 *           properties:
 *             invoiceNo:
 *               type: string
 *             reference:
 *               type: string
 *             invoiceDate:
 *               type: string
 *               example: 26-09-2024
 *             dueDate:
 *               type: string
 *               example: 26-09-2024
 *         itemList:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               no:
 *                 type: integer
 *               itemDescription:
 *                 type: string
 *               qty:
 *                 type: number
 *               unit:
 *                 type: string
 *               rate:
 *                 type: number
 *               total:
 *                 type: number
 *               taxable:
 *                 type: number
 *               discount:
 *                 type: number
 *               amount:
 *                 type: number
 *               hsn:
 *                 type: string
 *         status:
 *           type: string
 *           enum: ['Paid', 'Partially Paid', 'Overdue', 'Unpaid']
 *         finalTotal:
 *           type: string
 *         amount:
 *           type: string
 *         roundoff:
 *           type: string
 *         extracharges:
 *           type: string
 *         discount:
 *           type: string
 *         paidAmount:
 *           type: string
 *         balanceAmount:
 *           type: string
 *         project:
 *           type: string
 *         GSTIN:
 *           type: string
 *         address:
 *           type: object
 *           properties:
 *             address1:
 *              type: string
 *             address2:
 *              type: string
 *             city:
 *              type: string
 *             state:
 *              type: string
 *             country:
 *              type: string
 *             pincode:
 *              type: string
 *             type:
 *              type: string
 *              enum: ['Home','Office','Others']
 */

/**
 * @swagger
 * /api/invoice/invoice-wishlist/{id}:
 *   put:
 *     summary: Toggle invoice wishlist status by ID
 *     tags: [Invoices]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Invoice ID
 *     responses:
 *       200:
 *         description: Successfully updated invoice wishlist status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Status message indicating if the invoice was added or removed from the wishlist
 *                 invoice:
 *                   type: object
 *                   properties:
 *                     partyDetails:
 *                       type: object
 *                       properties:
 *                         contactPerson:
 *                           type: string
 *                         billingAddress:
 *                           type: string
 *                         salesCredit:
 *                           type: number
 *                         shippingAddress:
 *                           type: string
 *                         shippingDetails:
 *                           type: string
 *                     documentDetails:
 *                       type: object
 *                       properties:
 *                         invoiceNo:
 *                           type: string
 *                         reference:
 *                           type: string
 *                         invoiceDate:
 *                           type: string
 *                           format: date
 *                         dueDate:
 *                           type: string
 *                           format: date
 *                     _id:
 *                       type: string
 *                     type:
 *                       type: string
 *                     customer:
 *                       type: string
 *                     user:
 *                       type: string
 *                     itemList:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           no:
 *                             type: integer
 *                           itemDescription:
 *                             type: string
 *                           qty:
 *                             type: number
 *                           unit:
 *                             type: string
 *                           rate:
 *                             type: number
 *                           discount:
 *                             type: number
 *                           taxable:
 *                             type: number
 *                           CGST:
 *                             type: number
 *                           SGST:
 *                             type: number
 *                           hsn:
 *                             type: string
 *                     updatedId:
 *                       type: string
 *                     finalTotal:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: ['Paid', 'Partially Paid', 'Overdue', 'Unpaid']
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     wishlist:
 *                       type: boolean
 *                       description: Whether the invoice is in the wishlist
 *                     isDeleted:
 *                       type: boolean
 *                       description: Status indicating if the invoice is deleted
 *             examples:
 *               added:
 *                 summary: Example response when the invoice is added to the wishlist
 *                 value:
 *                   message: Invoice added to wishlist successfully
 *                   invoice:
 *                     partyDetails:
 *                       contactPerson: "John Doe"
 *                       billingAddress: "123 Main St"
 *                       salesCredit: 5000
 *                       shippingAddress: "456 Elm St"
 *                       shippingDetails: "Fast delivery"
 *                     documentDetails:
 *                       invoiceNo: "INV-1"
 *                       reference: "Ref-001"
 *                       invoiceDate: "12-08-2024"
 *                       dueDate: "12-09-2024"
 *                     _id: "66e3dadd0aebe25e68b5a4b5"
 *                     type: "party invoice"
 *                     customer: "66b0dff2600aff8c61024907"
 *                     user: "66c70763fa6dba1057f941f1"
 *                     itemList:
 *                       - no: 1
 *                         itemDescription: "Item 1"
 *                         qty: 10
 *                         unit: "pcs"
 *                         rate: 100
 *                         discount: 50
 *                         taxable: 950
 *                         CGST: 85.5
 *                         SGST: 85.5
 *                       - no: 2
 *                         itemDescription: "Item 2"
 *                         qty: 10
 *                         unit: "pcs"
 *                         rate: 10.5
 *                         discount: 50
 *                         taxable: 950
 *                         CGST: 85.5
 *                         SGST: 85.5
 *                     updatedId: "66c70763fa6dba1057f941f1"
 *                     finalTotal: "2242"
 *                     status: "paid"
 *                     createdAt: "2024-09-13T06:25:33.483Z"
 *                     updatedAt: "2024-09-19T19:56:01.528Z"
 *                     wishlist: true
 *                     isDeleted: false
 *               removed:
 *                 summary: Example response when the invoice is removed from the wishlist
 *                 value:
 *                   message: Invoice removed from wishlist successfully
 *                   invoice:
 *                     partyDetails:
 *                       contactPerson: "John Doe"
 *                       billingAddress: "123 Main St"
 *                       salesCredit: 5000
 *                       shippingAddress: "456 Elm St"
 *                       shippingDetails: "Fast delivery"
 *                     documentDetails:
 *                       invoiceNo: "INV-1"
 *                       reference: "Ref-001"
 *                       invoiceDate: "12-08-2024"
 *                       dueDate: "12-09-2024"
 *                     _id: "66e3dadd0aebe25e68b5a4b5"
 *                     type: "party invoice"
 *                     customer: "66b0dff2600aff8c61024907"
 *                     user: "66c70763fa6dba1057f941f1"
 *                     itemList:
 *                       - no: 1
 *                         itemDescription: "Item 1"
 *                         qty: 10
 *                         unit: "pcs"
 *                         rate: 100
 *                         discount: 50
 *                         taxable: 950
 *                         CGST: 85.5
 *                         SGST: 85.5
 *                       - no: 2
 *                         itemDescription: "Item 2"
 *                         qty: 10
 *                         unit: "pcs"
 *                         rate: 10.5
 *                         discount: 50
 *                         taxable: 950
 *                         CGST: 85.5
 *                         SGST: 85.5
 *                     updatedId: "66c70763fa6dba1057f941f1"
 *                     finalTotal: "2242"
 *                     status: "paid"
 *                     createdAt: "2024-09-13T06:25:33.483Z"
 *                     updatedAt: "2024-09-19T19:56:01.528Z"
 *                     wishlist: false
 *                     isDeleted: false
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/invoice/getCustomerAddresses/{id}:
 *   get:
 *     summary: Get All Addresses of a Customer
 *     tags: [Invoices]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Addresses fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 address1:
 *                   type: string
 *                 address2:
 *                  type: string
 *                 city:
 *                  type: string
 *                 state:
 *                  type: string
 *                 country:
 *                  type: string
 *                 pincode:
 *                  type: string
 *                 type:
 *                   type: string
 *                 customer:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *       400:
 *         description: Bad request
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/invoice/getAddressById/{id}:
 *   get:
 *     summary: Get Address By Address ID
 *     tags: [Invoices]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 address1:
 *                   type: string
 *                 address2:
 *                   type: string
 *                 city:
 *                   type: string
 *                 state:
 *                   type: string
 *                 country:
 *                   type: string
 *                 pincode:
 *                   type: string
 *                 type:
 *                   type: string
 *                 customer:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *       400:
 *         description: Bad request
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Internal Server Error
 */

//***************************************Order******************************************************************** */
/**
 * @swagger
 * /api/order/create-order:
 *   post:
 *     summary: Create a new sale order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer
 *               - partyDetails
 *               - documentDetails
 *               - itemList
 *               - bankDetails
 *               - total
 *               - grandTotal
 *             properties:
 *               customer:
 *                 type: string
 *                 description: Customer ID
 *               copyFrom:
 *                 type: string
 *               partyDetails:
 *                 type: object
 *                 properties:
 *                   contactPerson:
 *                     type: string
 *                   salesCredit:
 *                     type: string
 *                     enum: ["Yes", "No"]
 *                   shippingAddress:
 *                     type: string
 *                   executive:
 *                     type: string
 *               documentDetails:
 *                 type: object
 *                 properties:
 *                   orderNumber:
 *                     type: string
 *                   reference:
 *                     type: string
 *                   orderDate:
 *                     type: string
 *                     format: dd-mm-yyyy
 *                     example: 12-04-2024
 *                   dueDate:
 *                     type: string
 *                     format: dd-mm-yyyy
 *                     example: 12-04-2024
 *                   customerPoNumber:
 *                     type: string
 *               itemList:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemDescription:
 *                       type: string
 *                     hsnSac:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     unit:
 *                       type: string
 *                     rate:
 *                       type: number
 *                     discount:
 *                       type: number
 *                     taxable:
 *                       type: number
 *                     cgst:
 *                       type: number
 *                     sgst:
 *                       type: number
 *                     amount:
 *                       type: number
 *               address:
 *                 type: object
 *                 properties:
 *                   address1:
 *                    type: string
 *                   address2:
 *                    type: string
 *                   city:
 *                    type: string
 *                   state:
 *                    type: string
 *                   country:
 *                    type: string
 *                   pincode:
 *                    type: string
 *                   type:
 *                    type: string
 *                    enum: ['Home','Office','Others']
 *               bankDetails:
 *                 type: string
 *               total:
 *                 type: number
 *               grandTotal:
 *                 type: number
 *               addExtraCharges:
 *                 type: array
 *                 description: Additional charges to be added
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemName:
 *                       type: string
 *                       description: Name of the item for the extra charge
 *                     percentage:
 *                       type: number
 *                       description: Percentage of the extra charge
 *                     amount:
 *                       type: number
 *                       description: Amount of the extra charge
 *               addDiscount:
 *                 type: object
 *                 properties:
 *                   itemName:
 *                    type: string
 *                   percentage:
 *                    type: number
 *                   amount:
 *                    type: number
 *               status:
 *                 type: string
 *                 enum: ['Received', 'WIP', 'Query', 'Packed', 'Cancelled', 'Done']
 *                 default: 'Received'
 *               nextActions:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: boolean
 *                     default: false
 *                   whatsapp:
 *                     type: boolean
 *                     default: false
 *                   print:
 *                     type: boolean
 *                     default: false
 *                 description: "Optional actions to be taken, either email, whatsapp, or print"
 *           example:
 *             customer: "66b0dff2600aff8c61024907"
 *             copyFrom: "None"
 *             partyDetails:
 *               contactPerson: "JohnYesoe"
 *               salesCredit: "Yes"
 *               shippingAddress: "Same as Billing Address"
 *               executive: "Sarabjeet Singh"
 *             documentDetails:
 *               orderNumber: "ORD-177"
 *               reference: "Ref-123"
 *               orderDate: "12-12-2024"
 *               dueDate: "13-09-2025"
 *               customerPoNumber: "PO-456"
 *             itemList:
 *               - itemDescription: "Item 1"
 *                 hsnSac: "1234"
 *                 quantity: 10
 *                 unit: "Pieces"
 *                 rate: 100
 *                 discount: 5
 *                 taxable: 950
 *                 cgst: 47.5
 *                 sgst: 47.5
 *                 amount: 1045
 *             address:
 *               address1: Tada
 *               address2: Gnanmarg
 *               city: Sri City
 *               state: Andhra Pradesh
 *               country: India
 *               pincode: pincode
 *               type: Home
 *             termsConditions:
 *               - "Payment due in 30 days."
 *               - "Warranty period: 1 year."
 *             bankDetails: "6703a5451a519ce46da105d8"
 *             notes: "Handle with care."
 *             total: 2000
 *             grandTotal: 2035
 *             addExtraCharges:
 *             - itemName: itemName
 *               percentage: 0
 *               amount: 0
 *             addDiscount:
 *               itemName: itemName
 *               percentage: 0
 *               amount: 0
 *             status: Received
 *             nextActions:
 *               email: true
 *               whatsapp: false
 *               print: false
 *     responses:
 *       201:
 *         description: Sale order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 customer:
 *                   type: string
 *                 documentDetails:
 *                   type: object
 *                 itemList:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: number
 *                 grandTotal:
 *                   type: number
 *                 status:
 *                   type: string
 *                   enum: ['Received', 'WIP', 'Query', 'Packed', 'Cancelled', 'Done']
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


/*
/**
 * @swagger
 * /api/order/get-orders:
 *   get:
 *     summary: Get all sale orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of records per page
 *       - in: query
 *         name: startDate
 *         example: 2022-01-01
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering orders
 *       - in: query
 *         name: endDate
 *         example: 2022-01-01
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering orders
 *       - in: query
 *         name: executive
 *         schema:
 *           type: string
 *         description: Filter orders by executive name
 *       - in: query
 *         name: isWishlist
 *         schema:
 *           type: boolean
 *         description: Filter orders by wishlist status (true/false)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ['Received', 'WIP', 'Query', 'Packed', 'Cancelled', 'Done']
 *           default: 'Received'
 *         description: Filter orders by status ('Received', 'WIP', 'Query', 'Packed', 'Cancelled', 'Done')
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order for Orders within the current page (ascending or descending)
 *     responses:
 *       200:
 *         description: A list of sale orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       customer:
 *                         type: object
 *                         properties:
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                       total:
 *                         type: number
 *                       grandTotal:
 *                         type: number
 *                       status:
 *                         type: string
 *                         enum: ['Received', 'WIP', 'Query', 'Packed', 'Cancelled', 'Done']
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 totalOrders:
 *                   type: number
 *                 currentPage:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 hasPreviousPage:
 *                   type: boolean
 *                 hasNextPage:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/order/get-order/{id}:
 *   get:
 *     summary: Get a sale order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Sale order ID
 *     responses:
 *       200:
 *         description: Sale order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 customer:
 *                   type: string
 *                 itemList:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: number
 *                 grandTotal:
 *                   type: number
 *                 status:
 *                   type: string
 *                   enum: ['Received', 'WIP', 'Query', 'Packed', 'Cancelled', 'Done']
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Sale order not found
 *       500:
 *         description: Internal server error
 */




/**
 * @swagger
 * /api/order/update-order/{id}:
 *   put:
 *     summary: Update a sale order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Sale order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer:
 *                 type: string
 *               copyFrom:
 *                 type: string
 *                 description: Copy from another order or template
 *               partyDetails:
 *                 type: object
 *                 description: Details of the party
 *               documentDetails:
 *                 type: object
 *                 description: Document-related details
 *               itemList:
 *                 type: array
 *                 description: List of items in the order
 *                 items:
 *                   type: object
 *               address:
 *                 type: object
 *                 properties:
 *                   address1:
 *                    type: string
 *                   address2:
 *                    type: string
 *                   city:
 *                    type: string
 *                   state:
 *                    type: string
 *                   country:
 *                    type: string
 *                   pincode:
 *                    type: string
 *                   type:
 *                    type: string
 *                    enum: ['Home','Office','Others']
 *               termsConditions:
 *                 type: string
 *                 description: Terms and conditions
 *               bankDetails:
 *                 type: string
 *                 description: Bank details for the transaction
 *               notes:
 *                 type: string
 *               total:
 *                 type: number
 *               grandTotal:
 *                 type: number
 *               addExtraCharges:
 *                 type: array
 *                 description: Additional charges to be added
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemName:
 *                       type: string
 *                       description: Name of the item for the extra charge
 *                     percentage:
 *                       type: number
 *                       description: Percentage of the extra charge
 *                     amount:
 *                       type: number
 *                       description: Amount of the extra charge
 *               addDiscount:
 *                 type: object
 *                 properties:
 *                   itemName:
 *                    type: string
 *                   percentage:
 *                    type: number
 *                   amount:
 *                    type: number
 *                 description: Discounts applied to the total
 *               status:
 *                 type: string
 *                 enum: ['Received', 'WIP', 'Query', 'Packed', 'Cancelled', 'Done']
 *                 default: 'Received'
 *                 description: Status of the order
 *               nextActions:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: boolean
 *                     default: false
 *                   whatsapp:
 *                     type: boolean
 *                     default: false
 *                   print:
 *                     type: boolean
 *                     default: false
 *                 description: "Optional actions to be taken, either email, whatsapp, or print"
 *     responses:
 *       200:
 *         description: Sale order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Order updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     customer:
 *                       type: string
 *                     copyFrom:
 *                       type: string
 *                     partyDetails:
 *                       type: object
 *                     documentDetails:
 *                       type: object
 *                     itemList:
 *                       type: array
 *                     address:
 *                       type: object
 *                     termsConditions:
 *                       type: string
 *                     bankDetails:
 *                       type: object
 *                     notes:
 *                       type: string
 *                     total:
 *                       type: number
 *                     grandTotal:
 *                       type: number
 *                     addExtraCharges:
 *                       type: number
 *                     addDiscount:
 *                       type: number
 *                     status:
 *                       type: string
 *                       enum: ['Received', 'WIP', 'Query', 'Packed', 'Cancelled', 'Done']
 *                     nextActions:
 *                       email: true
 *                       whatsapp: false
 *                       print: false
 *                 updatedBy:
 *                   type: object
 *                   properties:
 *                     updatedId:
 *                       type: string
 *                     userName:
 *                       type: string
 *       400:
 *         description: Bad request
 *       404:
 *         description: Sale order not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/order/delete-order/{id}:
 *   delete:
 *     summary: Delete a sale order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Sale order ID
 *     responses:
 *       200:
 *         description: Sale order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sale order deleted successfully
 *       404:
 *         description: Sale order not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/order/clone-order/{id}:
 *   post:
 *     summary: Clone an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID to clone
 *     responses:
 *       201:
 *         description: Order cloned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         customerName:
 *           type: string
 *         orderDate:
 *           type: string
 *           format: date
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *         totalAmount:
 *           type: number
 *         isDeleted:
 *           type: boolean
 *         reason:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/order/exportorders:
 *   get:
 *     summary: Export orders to an Excel file
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Excel file containing all orders
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *         headers:
 *           Content-Disposition:
 *             schema:
 *               type: string
 *               example: attachment; filename=orders.xlsx
 *           Content-Type:
 *             schema:
 *               type: string
 *               example: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */

/**
 * @swagger
 * /api/order/order-wishlist/{id}:
 *   put:
 *     summary: Toggle Order wishlist status by ID
 *     tags: [Orders]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Order ID
 *     responses:
 *       200:
 *         description: Successfully updated order wishlist status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Status message indicating if the order was added or removed from the wishlist
 *                 order:
 *                   type: object
 *                   properties:
 *                     partyDetails:
 *                       type: object
 *                       properties:
 *                         contactPerson:
 *                           type: string
 *                         salesCredit:
 *                           type: string
 *                         shippingAddress:
 *                           type: string
 *                         executive:
 *                           type: string
 *                     documentDetails:
 *                       type: object
 *                       properties:
 *                         reference:
 *                           type: string
 *                         orderDate:
 *                           type: string
 *                           format: date
 *                         dueDate:
 *                           type: string
 *                           format: date
 *                         customerPoNumber:
 *                           type: string
 *                     _id:
 *                       type: string
 *                     customer:
 *                       type: string
 *                       description: Reference to the customer
 *                     user:
 *                       type: string
 *                       description: Reference to the user
 *                     copyFrom:
 *                       type: string
 *                     itemList:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           itemDescription:
 *                             type: string
 *                           hsnSac:
 *                             type: string
 *                           quantity:
 *                             type: number
 *                           unit:
 *                             type: string
 *                           rate:
 *                             type: number
 *                           discount:
 *                             type: number
 *                           taxable:
 *                             type: number
 *                           cgst:
 *                             type: number
 *                           sgst:
 *                             type: number
 *                           amount:
 *                             type: number
 *                     address:
 *                       type: object
 *                       properties:
 *                         address1:
 *                          type: string
 *                         address2:
 *                          type: string
 *                         city:
 *                          type: string
 *                         state:
 *                          type: string
 *                         country:
 *                          type: string
 *                         pincode:
 *                          type: string
 *                         type:
 *                          type: string
 *                     termsConditions:
 *                       type: array
 *                       items:
 *                         type: string
 *                     bankDetails:
 *                       type: string
 *                     notes:
 *                       type: string
 *                     total:
 *                       type: number
 *                     grandTotal:
 *                       type: number
 *                     addExtraCharges:
 *                       type: object
 *                       properties:
 *                         item:
 *                          type: string
 *                         itemName:
 *                          type: string
 *                         percentage:
 *                          type: number
 *                         amount:
 *                          type: number
 *                     addDiscount:
 *                       type: object
 *                       properties:
 *                         item:
 *                          type: string
 *                         itemName:
 *                          type: string
 *                         percentage:
 *                          type: number
 *                         amount:
 *                          type: number
 *                     isDeleted:
 *                       type: boolean
 *                     status:
 *                       type: string
 *                       enum: ['Received', 'WIP', 'Query', 'Packed', 'Cancelled', 'Done']
 *                     updatedId:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *                     wishlist:
 *                       type: boolean
 *                       description: Whether the order is in the wishlist
 *             examples:
 *               added:
 *                 summary: Example response when the order is added to the wishlist
 *                 value:
 *                   message: Order added to wishlist successfully
 *                   order:
 *                     partyDetails:
 *                       contactPerson: "JohnYesoe"
 *                       salesCredit: "Yes"
 *                       shippingAddress: "Same as Billing Address"
 *                       executive: "Sarabjeet Singh"
 *                     documentDetails:
 *                       reference: "Ref-123"
 *                       orderDate: "2024-08-28"
 *                       dueDate: "2024-09-28"
 *                       customerPoNumber: "PO-456"
 *                     _id: "66e984270cbf5ce876a9739b"
 *                     customer: "66b0dff2600aff8c61024907"
 *                     user: "66e97ae965c4c3951ada4f50"
 *                     itemList:
 *                       - itemDescription: "Item 1"
 *                         hsnSac: "1234"
 *                         quantity: 10
 *                         unit: "Pieces"
 *                         rate: 100
 *                         discount: 5
 *                         taxable: 950
 *                         cgst: 47.5
 *                         sgst: 47.5
 *                         amount: 1045
 *                       - itemDescription: "Item 2"
 *                         hsnSac: "5678"
 *                         quantity: 5
 *                         unit: "Pieces"
 *                         rate: 200
 *                         discount: 10
 *                         taxable: 900
 *                         cgst: 45
 *                         sgst: 45
 *                         amount: 990
 *                     address:
 *                       address1: Tada
 *                       address2: Gnanmarg
 *                       city: Sri City
 *                       state: Andhra Pradesh
 *                       country: India
 *                       pincode: pincode
 *                       type: Home
 *                     termsConditions:
 *                       - "Payment due in 30 days."
 *                       - "Warranty period: 1 year."
 *                     bankDetails: "XYZ Bank"
 *                     notes: "Handle with care."
 *                     total: 2000
 *                     grandTotal: 2035
 *                     addExtraCharges:
 *                       item: item
 *                       itemName: itemName
 *                       percentage: 0
 *                       amount: 0
 *                     addDiscount:
 *                       item: item
 *                       itemName: itemName
 *                       percentage: 0
 *                       amount: 0
 *                     isDeleted: false
 *                     status: Overdue
 *                     updatedId: "66e97ae965c4c3951ada4f50"
 *                     createdAt: "2024-09-17T13:29:11.238Z"
 *                     updatedAt: "2024-09-18T07:04:52.981Z"
 *                     wishlist: true
 *               removed:
 *                 summary: Example response when the order is removed from the wishlist
 *                 value:
 *                   message: Order removed from wishlist successfully
 *                   order:
 *                     partyDetails:
 *                       contactPerson: "JohnYesoe"
 *                       salesCredit: "Yes"
 *                       shippingAddress: "Same as Billing Address"
 *                       executive: "Sarabjeet Singh"
 *                     documentDetails:
 *                       reference: "Ref-123"
 *                       orderDate: "2024-08-28"
 *                       dueDate: "2024-09-28"
 *                       customerPoNumber: "PO-456"
 *                     _id: "66e984270cbf5ce876a9739b"
 *                     customer: "66b0dff2600aff8c61024907"
 *                     user: "66e97ae965c4c3951ada4f50"
 *                     itemList:
 *                       - itemDescription: "Item 1"
 *                         hsnSac: "1234"
 *                         quantity: 10
 *                         unit: "Pieces"
 *                         rate: 100
 *                         discount: 5
 *                         taxable: 950
 *                         cgst: 47.5
 *                         sgst: 47.5
 *                         amount: 1045
 *                       - itemDescription: "Item 2"
 *                         hsnSac: "5678"
 *                         quantity: 5
 *                         unit: "Pieces"
 *                         rate: 200
 *                         discount: 10
 *                         taxable: 900
 *                         cgst: 45
 *                         sgst: 45
 *                         amount: 990
 *                     termsConditions:
 *                       - "Payment due in 30 days."
 *                       - "Warranty period: 1 year."
 *                     bankDetails: "XYZ Bank"
 *                     notes: "Handle with care."
 *                     total: 2000
 *                     grandTotal: 2035
 *                     addExtraCharges:
 *                       item: item
 *                       itemName: itemName
 *                       percentage: 0
 *                       amount: 0
 *                     addDiscount:
 *                       item: item
 *                       itemName: itemName
 *                       percentage: 0
 *                       amount: 0
 *                     isDeleted: false
 *                     status: Overdue
 *                     updatedId: "66e97ae965c4c3951ada4f50"
 *                     createdAt: "2024-09-17T13:29:11.238Z"
 *                     updatedAt: "2024-09-18T07:04:52.981Z"
 *                     wishlist: false
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/order/convert-lead/{id}:
 *   post:
 *     summary: Convert a lead to an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the lead to convert into an order
 *     responses:
 *       201:
 *         description: Lead successfully converted to order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Lead successfully converted to Order
 *                 order:
 *                   type: object
 *                   properties:
 *                     customer:
 *                       type: string
 *                       description: Customer ID
 *                       example: "60d9b7a66e88f8f1b9a45e8b"
 *                     user:
 *                       type: string
 *                       description: ID of the user who created the order
 *                       example: "60c72b2f9b1d8a001d62f913"
 *                     partyDetails:
 *                       type: object
 *                       properties:
 *                         contactPerson:
 *                           type: string
 *                           description: Contact person's name
 *                           example: "John Doe"
 *                         salesCredit:
 *                           type: string
 *                           description: Sales credit status
 *                           example: "No"
 *                         executive:
 *                           type: string
 *                           description: Sales executive handling the order
 *                           example: "Jane Doe"
 *                     documentDetails:
 *                       type: object
 *                       properties:
 *                         orderNumber:
 *                           type: string
 *                           description: Generated order number
 *                           example: "ORD-1631697028559"
 *                         orderDate:
 *                           type: string
 *                           format: date-time
 *                           description: Date when the order was created
 *                           example: "2024-09-18T12:34:56.789Z"
 *                         dueDate:
 *                           type: string
 *                           format: date-time
 *                           description: Order due date
 *                           example: "2024-09-30T12:34:56.789Z"
 *                         customerPoNumber:
 *                           type: string
 *                           description: Customer purchase order number
 *                           example: "PO-12345"
 *                     itemList:
 *                       type: array
 *                       description: List of items in the order
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: string
 *                             description: Product ID
 *                             example: "60d9b7a66e88f8f1b9a45e8c"
 *                           quantity:
 *                             type: integer
 *                             description: Quantity of the product
 *                             example: 1
 *                           rate:
 *                             type: number
 *                             description: Rate of the product
 *                             example: 1000
 *                           discount:
 *                             type: number
 *                             description: Discount on the product
 *                             example: 0
 *                           amount:
 *                             type: number
 *                             description: Amount after applying the discount
 *                             example: 1000
 *                     total:
 *                       type: number
 *                       description: Total amount before tax
 *                       example: 1000
 *                     grandTotal:
 *                       type: number
 *                       description: Total amount after tax and discounts
 *                       example: 1180
 *                     bankDetails:
 *                       type: string
 *                       description: Bank details for payment
 *                       example: "Bank Details Here"
 *                     notes:
 *                       type: string
 *                       description: Additional notes for the order
 *                       example: "Some important notes here"
 *       404:
 *         description: Lead not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Lead not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized access
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

/**
 * @swagger
 * /api/order/undelete-order/{id}:
 *   put:
 *     summary: Undelete a sale order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Sale order ID
 *     responses:
 *       200:
 *         description: Sale order Undeleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sale order Undeleted successfully
 *       404:
 *         description: Sale order not found
 *       500:
 *         description: Internal server error
 */


//************************************************* Stage ********************************************************* */

/**
 * @swagger
 * tags:
 *   name: Prospect Stage
 *   description: Prospect Stage management
 */

/**
 * @swagger
 * /api/stage/create-stage:
 *   post:
 *     summary: Create a new stage
 *     tags: [Prospect Stage]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       201:
 *         description: stage created successfully
 *       400:
 *         description: Bad request or stage already exists for this role
 */

/**
 * @swagger
 * /api/stage/all-stage:
 *   get:
 *     summary: Retrieve all stages
 *     tags: [Prospect Stage]
 *     responses:
 *       200:
 *         description: List of all stages
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/stage/stage/{id}:
 *   get:
 *     summary: Get a stages by ID
 *     tags: [Prospect Stage]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: stage details
 *       404:
 *         description: stage not found
 */

/**
 * @swagger
 * /api/stage/deleted/{id}:
 *   delete:
 *     summary: Delete a stage
 *     tags: [Prospect Stage]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: stage deleted successfully
 *       404:
 *         description: stage not found
 */

/**
 * @swagger
 * /api/stage/update/{id}:
 *   put:
 *     summary: Update a stage
 *     tags: [Prospect Stage]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: stage updated successfully
 *       400:
 *         description: Bad request or stage already exists for this role
 *       404:
 *         description: stage not found
 */

//************************************************* purchase ********************************************************* */

/**
 * @swagger
 * /api/purchase/create-purchase:
 *   post:
 *     summary: Create a new purchase
 *     tags: [purchase]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - customer
 *               - contactPerson
 *               - address
 *               - shippingAddress
 *               - reference
 *               - quotationDate
 *               - dueDate
 *               - ItemList
 *               - bankDetails
 *               - totalAmountBeforeTax
 *               - total
 *               - grandTotal
 *             properties:
 *               customer:
 *                 type: string
 *                 description: The ID of the customer
 *               contactPerson:
 *                 type: string
 *                 description: Name of the contact person
 *               salesCredit:
 *                 type: string
 *                 enum: [Yes, No]
 *                 default: No
 *                 description: Indicates if sales credit is applied
 *               address:
 *                 type: string
 *                 description: Billing address
 *               shippingAddress:
 *                 type: string
 *                 description: Shipping address
 *               reference:
 *                 type: string
 *                 description: Reference number or code for the quotation
 *               quotationDate:
 *                 type: string
 *                 format: date
 *                 description: Date of quotation creation (YYYY-MM-DD)
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: Due date for the quotation (YYYY-MM-DD)
 *               ItemList:
 *                 type: string
 *                 description: A JSON string representing the list of items
 *                 example: '[{"itemandDescription":"Product A","hsnSac":"123456","quantity":2,"unit":"Piece","rate":100,"discount":10,"taxable":180,"cgst":9,"sgst":9,"amount":198}]'
 *               termsAndConditions:
 *                 type: string
 *                 description: Terms and conditions for the quotation
 *               notes:
 *                 type: string
 *                 description: Additional notes for the quotation
 *               bankDetails:
 *                 type: string
 *                 description: Bank details for payment
 *               totalAmountBeforeTax:
 *                 type: number
 *                 description: Total amount before tax
 *               total:
 *                 type: number
 *                 description: Total amount including tax
 *               grandTotal:
 *                 type: number
 *                 description: Grand total after applying discounts and extra charges
 *               addExtraCharges:
 *                 type: number
 *                 description: Additional charges to be added
 *                 default: 0
 *               addDiscount:
 *                 type: number
 *                 description: Discount to be applied
 *                 default: 0
 *               uploadFile:
 *                 type: string
 *                 format: binary
 *                 description: File to be uploaded with the quotation
 *     responses:
 *       200:
 *         description: purchase created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: purchase created successfully
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60c72b2f9b1d8a001d62f912
 *                     customer:
 *                       type: string
 *                       example: 60c72b2f9b1d8a001d62f913
 *                     contactPerson:
 *                       type: string
 *                       example: John Doe
 *                     salesCredit:
 *                       type: string
 *                       example: No
 *                     address:
 *                       type: string
 *                       example: 123 Main St, City, Country
 *                     shippingAddress:
 *                       type: string
 *                       example: 456 Elm St, City, Country
 *                     reference:
 *                       type: string
 *                       example: REF-001
 *                     quotationDate:
 *                       type: string
 *                       format: date
 *                       example: 2023-08-31
 *                     dueDate:
 *                       type: string
 *                       format: date
 *                       example: 2023-09-15
 *                     ItemList:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           itemandDescription:
 *                             type: string
 *                             example: Product A
 *                           hsnSac:
 *                             type: string
 *                             example: 123456
 *                           quantity:
 *                             type: number
 *                             example: 2
 *                           unit:
 *                             type: string
 *                             example: Piece
 *                           rate:
 *                             type: number
 *                             example: 100
 *                           discount:
 *                             type: number
 *                             example: 10
 *                           taxable:
 *                             type: number
 *                             example: 180
 *                           cgst:
 *                             type: number
 *                             example: 9
 *                           sgst:
 *                             type: number
 *                             example: 9
 *                           amount:
 *                             type: number
 *                             example: 198
 *                     termsAndConditions:
 *                       type: string
 *                       example: Payment due within 15 days
 *                     notes:
 *                       type: string
 *                       example: Thank you for your business
 *                     bankDetails:
 *                       type: string
 *                       example: {Bank: XYZ Bank, Account: 1234567890}
 *                     totalAmountBeforeTax:
 *                       type: number
 *                       example: 180
 *                     total:
 *                       type: number
 *                       example: 198
 *                     grandTotal:
 *                       type: number
 *                       example: 198
 *                     addExtraCharges:
 *                       type: number
 *                       example: 0
 *                     addDiscount:
 *                       type: number
 *                       example: 0
 *                     uploadFile:
 *                       type: string
 *                       example: https://example.com/uploads/quotation-60c72b2f9b1d8a001d62f912.pdf
 *                     quotationNo:
 *                       type: string
 *                       example: QOUT-1
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User or customer not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/purchase/getAllpurchase:
 *   get:
 *     summary: Get all purchase with pagination
 *     tags: [purchase]
 *     parameters:
 *       - in: query
 *         name: page
 *         type: integer
 *         description: Page number for pagination
 *         required: false
 *       - in: query
 *         name: pageSize
 *         type: integer
 *         description: Number of items per page for pagination 
 *         required: false
 *     responses:
 *       200:
 *         description: purchase fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: purchase fetched successfully
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     purchase:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 60c72b2f9b1d8a001d62f912
 *                           customer:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 60c72b2f9b1d8a001d62f913
 *                               name:
 *                                 type: string
 *                                 example: John Doe
 *                               email:
 *                                 type: string
 *                                 example: john.doe@example.com
 *                           contactPerson:
 *                             type: string
 *                             example: Jane Smith
 *                           salesCredit:
 *                             type: string
 *                             example: Yes
 *                           address:
 *                             type: string
 *                             example: 1234 Main St, Springfield, USA
 *                           shippingAddress:
 *                             type: string
 *                             example: 5678 Market St, Springfield, USA
 *                           quotationNo:
 *                             type: string
 *                             example: QOUT-001
 *                           reference:
 *                             type: string
 *                             example: RFQ-2024-05
 *                           quotationDate:
 *                             type: string
 *                             format: date
 *                             example: 2024-08-01
 *                           dueDate:
 *                             type: string
 *                             format: date
 *                             example: 2024-08-15
 *                           ItemList:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 itemandDescription:
 *                                   type: string
 *                                   example: Product A description
 *                                 hsnSac:
 *                                   type: string
 *                                   example: 123456
 *                                 unit:
 *                                   type: string
 *                                   enum: [Piece, Kg, Litre, Meter, Item]
 *                                   example: Piece
 *                                 rate:
 *                                   type: number
 *                                   example: 500.00
 *                                 discount:
 *                                   type: number
 *                                   example: 50.00
 *                                 taxable:
 *                                   type: number
 *                                   example: 450.00
 *                                 cgst:
 *                                   type: number
 *                                   example: 40.50
 *                                 sgst:
 *                                   type: number
 *                                   example: 40.50
 *                                 amount:
 *                                   type: number
 *                                   example: 531.00
 *                           termsAndConditions:
 *                             type: string
 *                             example: All sales are final.
 *                           notes:
 *                             type: string
 *                             example: Please deliver by the due date.
 *                           bankDetails:
 *                             type: string
 *                             example: "ABC Bank, Account No: 123456789."
 *                           totalAmountBeforeTax:
 *                             type: number
 *                             example: 10000.00
 *                           total:
 *                             type: number
 *                             example: 11800.00
 *                           grandTotal:
 *                             type: number
 *                             example: 11800.00
 *                           uploadFile:
 *                             type: file
 *                             example: https://s3.amazonaws.com/yourbucket/filename.pdf
 *                           addExtraCharges:
 *                             type: number
 *                             example: 100.00
 *                           addDiscount:
 *                             type: number
 *                             example: 50.00
 *                           isDeleted:
 *                             type: boolean
 *                             example: false
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *                     hasPreviousPage:
 *                       type: boolean
 *                       example: false
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     totalQuotations:
 *                       type: integer
 *                       example: 50
 *       404:
 *         description: No purchase found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No purchase found
 *                 status:
 *                   type: string
 *                   example: fail
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching purchase
 */

//************************************************* conctact administrator ********************************************************* */

/**
 * @swagger
 * tags:
 *   name: Contactus
 *   description: API for managing contact us submissions
 *
 * /api/contactus:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contactus]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - mobile
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the contact
 *               mobile:
 *                 type: string
 *                 description: Mobile number of the contact
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the contact
 *               Comment:
 *                 type: string
 *                 description: Additional comments or message
 *     responses:
 *       201:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 message:
 *                   type: string
 *                   example: Your message has been received successfully. We will contact you as soon as possible.
 *                 data:
 *                   $ref: '#/components/schemas/Contactus'
 *       400:
 *         description: Bad request - Invalid input data
 *       500:
 *         description: Internal server error
 * 
 *   get:
 *     summary: Retrieve all contacts
 *     tags: [Contactus]
 *     responses:
 *       200:
 *         description: List of all contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contactus'
 *       500:
 *         description: Internal server error
 * 
 * /api/contactus/{id}:
 *   get:
 *     summary: Get a contact by ID
 *     tags: [Contactus]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The contact ID
 *     responses:
 *       200:
 *         description: Contact details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   $ref: '#/components/schemas/Contactus'
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal server error
 * 
 *   put:
 *     summary: Update a contact
 *     tags: [Contactus]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               mobile:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               Comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 message:
 *                   type: string
 *                   example: Contact updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Contactus'
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal server error
 * 
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contactus]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The contact ID
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 message:
 *                   type: string
 *                   example: Contact deleted successfully
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal server error
 * 
 * components:
 *   schemas:
 *     Contactus:
 *       type: object
 *       required:
 *         - name
 *         - mobile
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the contact
 *         name:
 *           type: string
 *           description: Name of the contact
 *         mobile:
 *           type: string
 *           description: Mobile number of the contact
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the contact
 *         Comment:
 *           type: string
 *           description: Additional comments or message
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the contact was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the contact was last updated
 */

// ******************************* Bank detail ************************************************

/**
 * @swagger
 * /api/bankdetail:
 *   post:
 *     summary: Create a new bank detail
 *     tags: [Bank Details]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bankname
 *               - branch
 *               - accountnumber
 *               - IFSC
 *               - accountname
 *             properties:
 *               bankname:
 *                 type: string
 *               branch:
 *                 type: string
 *               accountnumber:
 *                 type: string
 *               IFSC:
 *                 type: string
 *               accountname:
 *                 type: string
 *     responses:
 *       201:
 *         description: Bank detail created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 accountname:
 *                   type: string
 *                 bankname:
 *                   type: string
 *                 branch:
 *                   type: string
 *                 accountnumber:
 *                   type: string
 *                 IFSC:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 *
 *   get:
 *     summary: Get all bank details
 *     tags: [Bank Details]
 *     responses:
 *       200:
 *         description: Successfully retrieved bank details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   accountname:
 *                     type: string
 *                   bankname:
 *                     type: string
 *                   branch:
 *                     type: string
 *                   accountnumber:
 *                     type: string
 *                   IFSC:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal Server Error
 *
 * /api/bankdetail/{id}:
 *   get:
 *     summary: Get a single bank detail by ID
 *     tags: [Bank Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The bank detail ID
 *     responses:
 *       200:
 *         description: Successfully retrieved bank detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 bankname:
 *                   type: string
 *                 branch:
 *                   type: string
 *                 accountnumber:
 *                   type: string
 *                 IFSC:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Bank detail not found
 *       500:
 *         description: Internal Server Error
 *
 *   put:
 *     summary: Update a bank detail
 *     tags: [Bank Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The bank detail ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountname:
 *                 type: string
 *               bankname:
 *                 type: string
 *               branch:
 *                 type: string
 *               accountnumber:
 *                 type: string
 *               IFSC:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bank detail updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 accountname:
 *                   type: string
 *                 bankname:
 *                   type: string
 *                 branch:
 *                   type: string
 *                 accountnumber:
 *                   type: string
 *                 IFSC:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request
 *       404:
 *         description: Bank detail not found
 *       500:
 *         description: Internal Server Error
 *
 *   delete:
 *     summary: Delete a bank detail
 *     tags: [Bank Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The bank detail ID
 *     responses:
 *       200:
 *         description: Bank detail deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bank detail deleted successfully
 *       404:
 *         description: Bank detail not found
 *       500:
 *         description: Internal Server Error
 */


// ****************************************** Payment ***************************************************

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: API for managing payments
 */

/**
 * @swagger
 * /api/payment/create-payment:
 *   post:
 *     summary: Create a new payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Payment data
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 */

/**
 * @swagger
 * /api/payment/getAllpayments:
 *   get:
 *     summary: Get all payments with pagination and date filtering
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Successfully retrieved payments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Payments fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment'
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 pageSize:
 *                   type: integer
 *                   example: 10
 *                 hasPreviousPage:
 *                   type: boolean
 *                   example: false
 *                 hasNextPage:
 *                   type: boolean
 *                   example: true
 *                 totalPayments:
 *                   type: integer
 *                   example: 50
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error occurred
 */

/**
 * @swagger
 * /api/payment/get-payment/{id}:
 *   get:
 *     summary: Get a payment by ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The payment ID
 *     responses:
 *       200:
 *         description: Payment fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/payment/update-payment/{id}:
 *   put:
 *     summary: Update a payment by ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The payment ID
 *     requestBody:
 *       description: Updated payment data
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/payment/delete-payment/{id}:
 *   delete:
 *     summary: Delete a payment by ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The payment ID
 *     responses:
 *       200:
 *         description: Payment deleted successfully
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/payment/download/paymentReceipt/{id}:
 *   get:
 *     summary: Download Payment PDF by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: PDF generated successfully
 *         headers:
 *           Content-Disposition:
 *             description: Header to specify the download filename
 *             schema:
 *               type: string
 *               example: attachment; filename=paymentReceipt-{id}.pdf
 *           X-Status-Message:
 *             description: Status message of the PDF generation
 *             schema:
 *               type: string
 *               example: PDF generated successfully
 *           X-Status-Code:
 *             description: HTTP Status code of the response
 *             schema:
 *               type: integer
 *               example: 200
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: payment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Payment not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred while generating the PDF.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       properties:
 *         customer:
 *           type: string
 *           description: Customer ID
 *         address:
 *           type: string
 *         mobileNumber:
 *           type: string
 *         alternateNumber:
 *           type: string
 *         receiptDate:
 *           type: string
 *           format: date
 *           example: '29-09-2024'
 *         receiptNumber:
 *           type: string
 *         dueDate:
 *           type: string
 *           format: date
 *           example: '29-09-2024'
 *         products:
 *           type: string
 *         amountReceived:
 *           type: string
 *         amountReceivedInFavourOf:
 *           type: string
 *         totalDueAmount:
 *           type: number
 *         amountPaid:
 *           type: number
 *         balanceDue:
 *           type: number
 *         description:
 *           type: string
 *         executive:
 *           type: string
 *           description: Name of the executive (User)
 *         paymentMode:
 *           type: string
 *           enum: ['CASH', 'CHEQUE', 'ONLINE']
 *         chequeDetails:
 *           type: string
 *         onlinePaymentDetails:
 *           type: object
 *           properties:
 *             mode:
 *               type: string
 *             bank:
 *               type: string
 *         authorizedSignatory:
 *           type: string
 *           format: binary
 *           description: Img to be uploaded with Authorized signatory
 */