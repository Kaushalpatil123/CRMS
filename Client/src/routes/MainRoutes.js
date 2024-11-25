import { lazy } from 'react';

// project-imports
import MainLayout from 'layout/MainLayout';
import CommonLayout from 'layout/CommonLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import Blog from 'pages/apps/blog/Blog';
import { element } from 'prop-types';
import CancelBookingDetails from 'pages/apps/cancel_booking/cancel_booking_details/CancelBookingDetails';
// import AddCustomer from 'pages/apps/Quote/addCustomer';
import SelectCustomer from 'pages/apps/Quote/selectCustomer';
import EditAddress from 'pages/apps/Quote/editAddress';
import EditQuotation from 'pages/apps/Quote/editQuotation';
import AddCustomer from 'pages/apps/Quote/addCustomerForAllModule';
import { useLocation } from 'react-router';
// import AddCustomer from 'pages/apps/Quote/addCustomer';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));
const CreatePaymentReceipt = Loadable(lazy(() => import('pages/apps/payment_receipts/create_payment_receipt')));
const ViewPaymentReceipt = Loadable(lazy(() => import('pages/apps/payment_receipts/view_payment_receipt')));


const DashboardAnalytics = Loadable(lazy(() => import('pages/dashboard/analytics')));

// render - widget
const WidgetStatistics = Loadable(lazy(() => import('pages/widget/statistics')));
// const WidgetData = Loadable(lazy(() => import('pages/widget/data')));
// const WidgetChart = Loadable(lazy(() => import('pages/widget/chart')));

// render - applications
const AppChat = Loadable(lazy(() => import('pages/apps/chat')));
const AppContact = Loadable(lazy(() => import('pages/apps/contact')));
const Appcontactus = Loadable(lazy(() => import('pages/apps/contactus')));
const Appallorder = Loadable(lazy(() => import('pages/apps/allorder')));
const Appallcoupons = Loadable(lazy(() => import('pages/apps/allcoupons')));
const Appallfaq = Loadable(lazy(() => import('pages/apps/faq/faq')));
const Quote = Loadable(lazy(() => import('pages/apps/Quote/quote')));
const Product = Loadable(lazy(() => import('pages/apps/product/Productlist')));
const CreateQuotation = Loadable(lazy(() => import('pages/apps/Quote/createQuotation')));

// const AppCalendar = Loadable(lazy(() => import('pages/apps/calendar')));

const AppKanban = Loadable(lazy(() => import('pages/apps/kanban')));
const AppKanbanBacklogs = Loadable(lazy(() => import('sections/apps/kanban/Backlogs')));
const AppKanbanBoard = Loadable(lazy(() => import('sections/apps/kanban/Board')));

const AppCustomerList = Loadable(lazy(() => import('pages/apps/customer/list')));
const AppCustomerCard = Loadable(lazy(() => import('pages/apps/customer/card')));
const CreateCustomer = Loadable(lazy(() => import('pages/apps/Quote/addCustomer')));
// const AppBlogCard = Loadable(lazy(() => import('pages/apps/blog/Blog')));

const AppInvoiceCreate = Loadable(lazy(() => import('pages/apps/invoice/create')));
const AppInvoiceDashboard = Loadable(lazy(() => import('pages/apps/invoice/dashboard')));
const AppInvoiceList = Loadable(lazy(() => import('pages/apps/invoice/list')));
const AppCustomInvoices = Loadable(lazy(() => import('pages/apps/invoice/custom-invoices')));
const AppInvoiceDetails = Loadable(lazy(() => import('pages/apps/invoice/details')));
const AppInvoiceEdit = Loadable(lazy(() => import('pages/apps/invoice/edit')));


const UserProfile = Loadable(lazy(() => import('pages/apps/profiles/user')));
const UserTabPersonal = Loadable(lazy(() => import('sections/apps/profiles/user/TabPersonal')));
const UserTabPayment = Loadable(lazy(() => import('sections/apps/profiles/user/TabPayment')));
const UserTabPassword = Loadable(lazy(() => import('sections/apps/profiles/user/TabPassword')));
const UserTabSettings = Loadable(lazy(() => import('sections/apps/profiles/user/TabSettings')));

const AccountProfile = Loadable(lazy(() => import('pages/apps/profiles/account')));
const AccountTabProfile = Loadable(lazy(() => import('sections/apps/profiles/account/TabProfile')));
const AccountTabPersonal = Loadable(lazy(() => import('sections/apps/profiles/account/TabPersonal')));
const AccountTabAccount = Loadable(lazy(() => import('sections/apps/profiles/account/TabAccount')));
const AccountTabPassword = Loadable(lazy(() => import('sections/apps/profiles/account/TabPassword')));
const AccountTabRole = Loadable(lazy(() => import('sections/apps/profiles/account/TabRole')));
const AccountTabSettings = Loadable(lazy(() => import('sections/apps/profiles/account/TabSettings')));

const AppECommProducts = Loadable(lazy(() => import('pages/apps/customer/e-commerce/product')));
const AppECommProductDetails = Loadable(lazy(() => import('pages/apps/customer/e-commerce/product-details')));
const AppECommProductList = Loadable(lazy(() => import('pages/apps/customer/e-commerce/products-list')));
const AppECommCheckout = Loadable(lazy(() => import('pages/apps/customer/e-commerce/checkout')));
const AppECommAddProduct = Loadable(lazy(() => import('pages/apps/customer/e-commerce/add-product')));

// render - forms & tables
const FormsValidation = Loadable(lazy(() => import('pages/forms/validation')));
const FormsWizard = Loadable(lazy(() => import('pages/forms/wizard')));

const FormsLayoutBasic = Loadable(lazy(() => import('pages/forms/layouts/basic')));
const FormsLayoutMultiColumn = Loadable(lazy(() => import('pages/forms/layouts/multi-column')));
const FormsLayoutActionBar = Loadable(lazy(() => import('pages/forms/layouts/action-bar')));
const FormsLayoutStickyBar = Loadable(lazy(() => import('pages/forms/layouts/sticky-bar')));

const FormsPluginsMask = Loadable(lazy(() => import('pages/forms/plugins/mask')));
const FormsPluginsClipboard = Loadable(lazy(() => import('pages/forms/plugins/clipboard')));
const FormsPluginsRecaptcha = Loadable(lazy(() => import('pages/forms/plugins/re-captcha')));
const FormsPluginsEditor = Loadable(lazy(() => import('pages/forms/plugins/editor')));
const FormsPluginsDropzone = Loadable(lazy(() => import('pages/forms/plugins/dropzone')));

const ReactTableBasic = Loadable(lazy(() => import('pages/tables/react-table/basic')));
const ReactTableSorting = Loadable(lazy(() => import('pages/tables/react-table/sorting')));
const ReactTableFiltering = Loadable(lazy(() => import('pages/tables/react-table/filtering')));
const ReactTableGrouping = Loadable(lazy(() => import('pages/tables/react-table/grouping')));
const ReactTablePagination = Loadable(lazy(() => import('pages/tables/react-table/pagination')));
const ReactTableRowSelection = Loadable(lazy(() => import('pages/tables/react-table/row-selection')));
const ReactTableExpanding = Loadable(lazy(() => import('pages/tables/react-table/expanding')));
const ReactTableEditable = Loadable(lazy(() => import('pages/tables/react-table/editable')));
const ReactTableDragDrop = Loadable(lazy(() => import('pages/tables/react-table/drag-drop')));
const ReactTableColumnHiding = Loadable(lazy(() => import('pages/tables/react-table/column-hiding')));
const ReactTableColumnResizing = Loadable(lazy(() => import('pages/tables/react-table/column-resizing')));
const ReactTableStickyTable = Loadable(lazy(() => import('pages/tables/react-table/sticky')));
const ReactTableUmbrella = Loadable(lazy(() => import('pages/tables/react-table/umbrella')));
const ReactTableEmpty = Loadable(lazy(() => import('pages/tables/react-table/empty')));

// render - charts & map
const ChartApexchart = Loadable(lazy(() => import('pages/charts/apexchart')));
const ChartOrganization = Loadable(lazy(() => import('pages/charts/org-chart')));

// table routing
const MuiTableBasic = Loadable(lazy(() => import('pages/tables/mui-table/basic')));
const MuiTableDense = Loadable(lazy(() => import('pages/tables/mui-table/dense')));
const MuiTableEnhanced = Loadable(lazy(() => import('pages/tables/mui-table/enhanced')));
const MuiTableDatatable = Loadable(lazy(() => import('pages/tables/mui-table/datatable')));
const MuiTableCustom = Loadable(lazy(() => import('pages/tables/mui-table/custom')));
const MuiTableFixedHeader = Loadable(lazy(() => import('pages/tables/mui-table/fixed-header')));
const MuiTableCollapse = Loadable(lazy(() => import('pages/tables/mui-table/collapse')));

// pages routing
const AuthLogin = Loadable(lazy(() => import('pages/auth/auth1/login')));
const AuthRegister = Loadable(lazy(() => import('pages/auth/auth1/register')));
const AuthForgotPassword = Loadable(lazy(() => import('pages/auth/auth1/forgot-password')));
const AuthResetPassword = Loadable(lazy(() => import('pages/auth/auth1/reset-password')));
const AuthCheckMail = Loadable(lazy(() => import('pages/auth/auth1/check-mail')));
const AuthCodeVerification = Loadable(lazy(() => import('pages/auth/auth1/code-verification')));

const AuthLogin2 = Loadable(lazy(() => import('pages/auth/auth2/login2')));
const AuthRegister2 = Loadable(lazy(() => import('pages/auth/auth2/register2')));
const AuthForgotPassword2 = Loadable(lazy(() => import('pages/auth/auth2/forgot-password2')));
const AuthResetPassword2 = Loadable(lazy(() => import('pages/auth/auth2/reset-password2')));
const AuthCheckMail2 = Loadable(lazy(() => import('pages/auth/auth2/check-mail2')));
const AuthCodeVerification2 = Loadable(lazy(() => import('pages/auth/auth2/code-verification2')));

const AuthLogin3 = Loadable(lazy(() => import('pages/auth/auth3/login3')));

const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/error/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/error/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction/under-construction')));
const MaintenanceUnderConstruction2 = Loadable(lazy(() => import('pages/maintenance/under-construction/under-construction2')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon/coming-soon')));
const MaintenanceComingSoon2 = Loadable(lazy(() => import('pages/maintenance/coming-soon/coming-soon2')));

// render - sample page
// const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));
const Landing = Loadable(lazy(() => import('pages/landing')));
const ContactUS = Loadable(lazy(() => import('pages/contact-us')));
const Alladmins = Loadable(lazy(() => import('pages/apps/admins/all_admins/list')));
const Subscriptions = Loadable(lazy(() => import('pages/apps/subscriptions/subscription')));
const Grounds = Loadable(lazy(() => import('pages/apps/ground/all_grounds/list')));
const Prospects = Loadable(lazy(() => import('pages/apps/prospects/all_prospects/salesprospects')));

const Paymnethistory = Loadable(lazy(() => import('pages/apps/payment/paymenthistory')));
const CoachList = Loadable(lazy(() => import('pages/apps/coach/coach')));
const SchoolsList = Loadable(lazy(() => import('pages/apps/schools/schools')));
const CreateSchools = Loadable(lazy(() => import('pages/apps/schools/create')));
const ViewSchools = Loadable(lazy(() => import('pages/apps/schools/SchoolDetails')));
const CreateGround = Loadable(lazy(() => import('pages/apps/ground/ground_create/create')));
const CreateProspects = Loadable(lazy(() => import('pages/apps/prospects/prospects_create/create')));
const ViewGround = Loadable(lazy(() => import('pages/apps/ground/ground_view/view')));
const EditProspects = Loadable(lazy(() => import('pages/apps/prospects/editprospects')));
const Slots = Loadable(lazy(() => import('pages/apps/ground/ground_create/slot')));
const CreateCoach = Loadable(lazy(() => import('pages/apps/coach/create_coach/create')));
const CoachAvailability = Loadable(lazy(() => import('pages/apps/coach_availability/create_coach_availability/coachavailability')));
const Sports = Loadable(lazy(() => import('pages/apps/sports/sports')));
const EditCoach = Loadable(lazy(() => import('pages/apps/coach/editcoach')));
const ViewCoach = Loadable(lazy(() => import('pages/apps/coach/coach_view/view')));
const EditGround = Loadable(lazy(() => import('pages/apps/ground/editground')));
const EditSchool = Loadable(lazy(() => import('pages/apps/schools/editschools')));
const CoachAvailabilityList = Loadable(lazy(() => import('pages/apps/coach_availability/all_coaches_availability/coachesavailability')));
const CoachAvailabilityEdit = Loadable(lazy(() => import('pages/apps/coach_availability/edit_coach_availability/coachavailability')));

const GroundBooking = Loadable(lazy(() => import('pages/apps/bookings/ground_booking/ground_booking')));
const CoachBooking = Loadable(lazy(() => import('pages/apps/bookings/coach_booking/coach_booking')));
const GroundBookingDetails = Loadable(
  lazy(() => import('pages/apps/bookings/ground_booking/ground_booking_details/ground_booking_details'))
);
const CoachBookingDetails = Loadable(lazy(() => import('pages/apps/bookings/coach_booking/coach_booking_details/coach_booking_details')));
const AuthSchoolLogin = Loadable(lazy(() => import('sections/auth/auth-forms/AuthSchoolLogin')));
const SubScriptionUser = Loadable(lazy(() => import('pages/apps/subScriptionUser')));
const WithoutSubscription = Loadable(lazy(() => import('pages/apps/withoutSubscription')));
const AllSchools = Loadable(lazy(() => import('pages/apps/allSchools')));
const AllStudents = Loadable(lazy(() => import('pages/apps/allStudents')));
const AllComplaints = Loadable(lazy(() => import('pages/apps/Complaints')));
const Orders = Loadable(lazy(() => import('pages/apps/orders/list')));
const EnterOrder = Loadable(lazy(() => import('pages/apps/orders/enterOrder')));
const AllCancelBookings = Loadable(lazy(() => import('pages/apps/cancel_booking/list')));
const AllCoachEarnings = Loadable(lazy(() => import('pages/apps/coach_earning/all_coach_earning/CoachEarning')));
const CreateLead = Loadable(lazy(() => import('pages/apps/leads/create')));

const AppOrderList = Loadable(lazy(() => import('pages/apps/orders/list')));
const Appallleads = Loadable(lazy(() => import('pages/apps/leads/list')));
//const AppallUserSessions = Loadable(lazy(() => import('pages/apps/user_working_sessions/list')));
const AppPaymentReceipts = Loadable(lazy(() => import('pages/apps/payment_receipts/payment_receipts')));
const AppallPurchases = Loadable(lazy(() => import('pages/apps/purchases/Purchases')));
const AppaddPurchases = Loadable(lazy(() => import('pages/apps/purchases/create')));
const AppLeadsDetails = Loadable(lazy(() => import('pages/apps/leads/leadDetails')));
const AppOrderDetails = Loadable(lazy(() => import('pages/apps/orders/editOrder')));

const AppProductCreate = Loadable(lazy(() => import('pages/apps/product/create')));
const AppProductDetails = Loadable(lazy(() => import('pages/apps/product/productDetails')));

// const PricingPage = Loadable(lazy(() => import('pages/extra-pages/price/price1')));
// const PricingPage2 = Loadable(lazy(() => import('pages/extra-pages/price/price2')));

const Appallusers = Loadable(lazy(() => import('pages/apps/user_management/list')));
const AppUserDetails = Loadable(lazy(() => import('pages/apps/user_management/userDetails')));




// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'dashboard',
          children: [
            {
              path: 'default',
              element: <DashboardDefault />
            },
            {
              path: 'analytics',
              element: <DashboardAnalytics />
            },

          ]
        },

       

        {
          path: 'widget',
          children: [
            {
              path: 'statistics',
              element: <WidgetStatistics />
            }
            // {
            //   path: 'data',
            //   element: <WidgetData />
            // },
            // {
            //   path: 'chart',
            //   element: <WidgetChart />
            // }
          ]
        },
        {
          path: 'apps',
          children: [
            {
              path: 'edit-coach/:id',
              element: <EditCoach />
            },
            {
              path: 'subscription-history',
              element: <SubScriptionUser />
            },
            {
              path: 'booking-history',
              element: <WithoutSubscription />
            },
            {
              path: 'all-schools',
              element: <AllSchools />
            },
            {
              path: 'all-students',
              element: <AllStudents />
            },

            // {
            //   path: 'add-lead`',
            //   element: <CreateLead />
            // },

            {
              path: 'edit-ground/:id',
              element: <EditGround />
            },

            {
              path: 'edit-school/:id',
              element: <EditSchool />
            },
            {
              path: 'edit-coach-availability/:id',
              element: <CoachAvailabilityEdit />
            },

            {
              path: 'ground-booking',
              element: <GroundBooking />
            },

            {
              path: 'coach-booking',
              element: <CoachBooking />
            },
            {
              path: 'ground-booking-details/:id',
              element: <GroundBookingDetails />
            },
            {
              path: 'cancel-booking',
              element: <AllCancelBookings />
            },

            {
              path: 'coach-earning',
              element: <AllCoachEarnings />
            },
            {
              path: 'cancel-booking-details/:id',
              element: <CancelBookingDetails />
            },
            {
              path: 'coach-booking-details/:id',
              element: <CoachBookingDetails />
            },
            {
              path: 'chat',
              element: <AppChat />
            },

            {
              path: 'contact',
              element: <AppContact />
            },
            {
              path: 'paymenthistory',
              element: <Paymnethistory />
            },
            {
              path: 'allcomplaints',
              element: <AllComplaints />
            },
            {
              path: 'list',
              element: <Orders />
            },
            {
              path: 'orders/enter-order',
              element: <EnterOrder />
            },
            {
              path: 'orders/list',
              element: <AppOrderList />
            },
            {
              path: 'slots',
              element: <Slots />
            },

            {
              path: 'create-coach',
              element: <CreateCoach />
            },
            {
              path: 'view-coach/:id',
              element: <ViewCoach />
            },
            {
              path: 'view-ground/:id',
              element: <ViewGround />
            },
            {
              path: 'edit-prospects/:id',
              element: <EditProspects />
            },

            {
              path: 'all-coaches-availability',
              element: <CoachAvailabilityList />
            },

            {
              path: 'create-coach-availability',
              element: <CoachAvailability />
            },
            // {
            //   path: 'calendar',
            //   element: <AppCalendar />
            // },
            {
              path: 'kanban',
              element: <AppKanban />,
              children: [
                {
                  path: 'backlogs',
                  element: <AppKanbanBacklogs />
                },
                {
                  path: 'board',
                  element: <AppKanbanBoard />
                }
              ]
            },
            {
              path: 'customer',
              children: [
                {
                  path: 'customer-list',
                  element: <AppCustomerList />
                },
                {
                  path: 'customer-card',
                  element: <AppCustomerCard />
                }
              ]
            },


            // {
            //   path: 'create-customer',
            //   element: <CreateCustomer />
            // },


            // {
            //   path: 'blog',
            //   children: [
            //     {
            //       path: 'blog',
            //       element: <Blog />
            //     }
            //     // {
            //     //   path: 'customer-card',
            //     //   element: <AppCustomerCard />
            //     // }
            //   ]
            // },
            {
              path: 'invoice',
              children: [
                {
                  path: 'dashboard',
                  element: <AppInvoiceDashboard />
                },
                {
                  path: 'create',
                  element: <AppInvoiceCreate />
                },
                {
                  path: 'details/:id',
                  element: <AppInvoiceDetails />
                },
                {
                  path: 'edit/:id',
                  element: <AppInvoiceEdit />
                },
                {
                  path: 'list',
                  element: <AppInvoiceList />
                },
                {
                  path: 'custom-invoices',
                  element: <AppCustomInvoices />
                }
              ]
            },
            // {
            //   path: 'orders',
            //   children: [
            //     {
            //       path: 'list',
            //       element: <AppOrderList />
            //     }
            //   ]
            // },
            {
              path: 'profiles',
              children: [
                {
                  path: 'account',
                  element: <AccountProfile />,
                  children: [
                    {
                      path: 'basic',
                      element: <AccountTabProfile />
                    },
                    {
                      path: 'personal',
                      element: <AccountTabPersonal />
                    },
                    {
                      path: 'my-account',
                      element: <AccountTabAccount />
                    },
                    {
                      path: 'password',
                      element: <AccountTabPassword />
                    },
                    {
                      path: 'role',
                      element: <AccountTabRole />
                    },
                    {
                      path: 'settings',
                      element: <AccountTabSettings />
                    }
                  ]
                },
                {
                  path: 'user',
                  element: <UserProfile />,
                  children: [
                    {
                      path: 'personal',
                      element: <UserTabPersonal />
                    },
                    {
                      path: 'payment',
                      element: <UserTabPayment />
                    },
                    {
                      path: 'password',
                      element: <UserTabPassword />
                    },
                    {
                      path: 'settings',
                      element: <UserTabSettings />
                    }
                  ]
                }
              ]
            },
            {
              path: 'e-commerce',
              children: [
                {
                  path: 'products',
                  element: <AppECommProducts />
                },
                {
                  path: 'product-details/:id',
                  element: <AppECommProductDetails />
                },
                {
                  path: 'services-list',
                  element: <AppECommProductList />
                },
                {
                  path: 'add-new-product',
                  element: <AppECommAddProduct />
                },
                {
                  path: 'checkout',
                  element: <AppECommCheckout />
                }
              ]
            },
            // {
            //   path: 'allorder',
            //   element: <Appallorder />
            // },
            {
              path: 'alladmins',
              element: <Alladmins />
            },

            {
              path: 'create-schools',
              element: <CreateSchools />
            },

            {
              path: 'view-schools/:id',
              element: <ViewSchools />
            },
            {
              path: 'create-grounds',
              element: <CreateGround />
            },

            {
              path: 'create-prospects',
              element: <CreateProspects />
            },

            {
              path: 'subscriptions',
              element: <Subscriptions />
            },
            {
              path: 'sports',
              element: <Sports />
            },
            {
              path: 'prospects',
              element: <Prospects />
            },
            {
              path: 'grounds',
              element: <Grounds />
            },
            {
              path: 'coach',
              element: <CoachList />
            },

            {
              path: 'schools',
              element: <SchoolsList />
            },
            {
              path: '/apps/faq',
              element: <Appallfaq />
            },
            {
              path: '/apps/product',
              element: <Product />
            },
            {
              path: '/apps/product/create',
              element: <AppProductCreate />
            },

            {
              path: '/apps/product/details/:id',
              element: <AppProductDetails />
            },
            {
              path: '/apps/quote',
              element: <Quote />
            },

            {
              path: '/apps/quote/createQuote',
              element: <CreateQuotation />
            },

            {
              path: '/apps/quote/editQuote',
              element: <EditQuotation />
            },

            {
              path: '/apps/lead',
              element: <Appallleads />
            },
            // {
            //   path: '/apps/user_sessions',
            //   element: <AppallUserSessions />
            // },
            {
              path: '/apps/lead/add-lead',
              element: <CreateLead />
            },
            {
              path: '/apps/payment_receipts',
              element: <AppPaymentReceipts />
            },
            {
              path: '/apps/payment_receipts/create_payment_receipt',
              element: <CreatePaymentReceipt />
            },
            {
              path: '/apps/payment_receipts/create_payment_receipt/:id',
              element: <CreatePaymentReceipt />
            },
            {
              path: '/apps/payment_receipts/view_payment_receipt/:id',
              element: <ViewPaymentReceipt />
            },
            {
              path: '/apps/users/:id',
              element: <AppUserDetails />
            },

            {
              path: '/apps/lead/details/:id',
              element: <AppLeadsDetails />
            },
            {
              path: '/apps/orders/editOrder/:id',
              element: <AppOrderDetails />
            },

            {
              path: '/apps/users',
              element: <Appallusers />
            },

            {
              path: '/apps/add-purchase',
              element: <AppaddPurchases />
            },

            {
              path: '/apps/purchase',
              element: <AppallPurchases />
            },
            
            {
              path: '/apps/quote/addCustomer',
              element: <AddCustomer />
            },
            {
              path: '/apps/quotation/selectCustomer',
              element: <SelectCustomer />
            },
            {
              path: '/apps/quotation/editAddress',
              element: <EditAddress />
            },
            {
              path: 'allcoupons',
              element: <Appallcoupons />
            }
            // {
            //   path: 'contactus',
            //   element: <Appcontactus />
            // }
          ]
        },
        {
          path: 'forms',
          children: [
            {
              path: 'validation',
              element: <FormsValidation />
            },
            {
              path: 'wizard',
              element: <FormsWizard />
            },
            {
              path: 'layout',
              children: [
                {
                  path: 'basic',
                  element: <FormsLayoutBasic />
                },
                {
                  path: 'multi-column',
                  element: <FormsLayoutMultiColumn />
                },
                {
                  path: 'action-bar',
                  element: <FormsLayoutActionBar />
                },
                {
                  path: 'sticky-bar',
                  element: <FormsLayoutStickyBar />
                }
              ]
            },
            {
              path: 'plugins',
              children: [
                {
                  path: 'mask',
                  element: <FormsPluginsMask />
                },
                {
                  path: 'clipboard',
                  element: <FormsPluginsClipboard />
                },
                {
                  path: 're-captcha',
                  element: <FormsPluginsRecaptcha />
                },
                {
                  path: 'editor',
                  element: <FormsPluginsEditor />
                },
                {
                  path: 'dropzone',
                  element: <FormsPluginsDropzone />
                }
              ]
            }
          ]
        },
        {
          path: 'tables',
          children: [
            {
              path: 'react-table',
              children: [
                {
                  path: 'basic',
                  element: <ReactTableBasic />
                },
                {
                  path: 'sorting',
                  element: <ReactTableSorting />
                },
                {
                  path: 'filtering',
                  element: <ReactTableFiltering />
                },
                {
                  path: 'grouping',
                  element: <ReactTableGrouping />
                },
                {
                  path: 'pagination',
                  element: <ReactTablePagination />
                },
                {
                  path: 'row-selection',
                  element: <ReactTableRowSelection />
                },
                {
                  path: 'expanding',
                  element: <ReactTableExpanding />
                },
                {
                  path: 'editable',
                  element: <ReactTableEditable />
                },
                {
                  path: 'drag-drop',
                  element: <ReactTableDragDrop />
                },
                {
                  path: 'column-hiding',
                  element: <ReactTableColumnHiding />
                },
                {
                  path: 'column-resizing',
                  element: <ReactTableColumnResizing />
                },
                {
                  path: 'sticky-table',
                  element: <ReactTableStickyTable />
                },
                {
                  path: 'umbrella',
                  element: <ReactTableUmbrella />
                },
                {
                  path: 'empty',
                  element: <ReactTableEmpty />
                }
              ]
            },
            {
              path: 'mui-table',
              children: [
                {
                  path: 'basic',
                  element: <MuiTableBasic />
                },
                {
                  path: 'dense',
                  element: <MuiTableDense />
                },
                {
                  path: 'enhanced',
                  element: <MuiTableEnhanced />
                },
                {
                  path: 'datatable',
                  element: <MuiTableDatatable />
                },
                {
                  path: 'custom',
                  element: <MuiTableCustom />
                },
                {
                  path: 'fixed-header',
                  element: <MuiTableFixedHeader />
                },
                {
                  path: 'collapse',
                  element: <MuiTableCollapse />
                }
              ]
            }
          ]
        },
        {
          path: 'charts',
          children: [
            {
              path: 'apexchart',
              element: <ChartApexchart />
            },
            {
              path: 'org-chart',
              element: <ChartOrganization />
            }
          ]
        }
        // {
        //   path: 'sample-page',
        //   element: <SamplePage />
        // },
        // {
        //   path: 'price',
        //   children: [
        //     {
        //       path: 'price1',
        //       element: <PricingPage />
        //     },
        //     {
        //       path: 'price2',
        //       element: <PricingPage2 />
        //     }
        //   ]
        // }
      ]
    },
    {
      path: '/',
      element: <CommonLayout layout="landing" />,
      children: [
        {
          path: 'landing',
          element: <Landing />
        }
      ]
    },
    {
      path: '/',
      element: <CommonLayout layout="simple" />,
      children: [
        {
          path: 'contact-us',
          element: <ContactUS />
        }
      ]
    },
    {
      path: '/maintenance',
      element: <CommonLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'under-construction2',
          element: <MaintenanceUnderConstruction2 />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        },
        {
          path: 'coming-soon2',
          element: <MaintenanceComingSoon2 />
        }
      ]
    },
    {
      path: '/auth',
      element: <CommonLayout />,
      children: [
        {
          path: 'login',
          element: <AuthLogin />
        },
        {
          path: 'school-login',
          element: <AuthSchoolLogin />
        },
        {
          path: 'register',
          element: <AuthRegister />
        },
        {
          path: 'forgot-password',
          element: <AuthForgotPassword />
        },
        {
          path: 'reset-password',
          element: <AuthResetPassword />
        },
        {
          path: 'check-mail',
          element: <AuthCheckMail />
        },
        {
          path: 'code-verification',
          element: <AuthCodeVerification />
        },
        {
          path: 'login2',
          element: <AuthLogin2 />
        },
        {
          path: 'register2',
          element: <AuthRegister2 />
        },
        {
          path: 'forgot-password2',
          element: <AuthForgotPassword2 />
        },
        {
          path: 'reset-password2',
          element: <AuthResetPassword2 />
        },
        {
          path: 'check-mail2',
          element: <AuthCheckMail2 />
        },
        {
          path: 'code-verification2',
          element: <AuthCodeVerification2 />
        },
        {
          path: 'login3',
          element: <AuthLogin3 />
        }
      ]
    }
  ]
};

export default MainRoutes;
