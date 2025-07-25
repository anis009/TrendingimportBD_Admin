import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-10 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">TrendingImportBD</NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex list-none flex-col gap-1.5">
              <li>
                <NavLink
                  to="/orders"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('orders') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.75 3.375H14.625V2.25C14.625 1.629 14.121 1.125 13.5 1.125S12.375 1.629 12.375 2.25v1.125H5.625V2.25C5.625 1.629 5.121 1.125 4.5 1.125S3.375 1.629 3.375 2.25v1.125H2.25C1.007 3.375 0 4.382 0 5.625v9C0 15.868 1.007 16.875 2.25 16.875h13.5c1.243 0 2.25-1.007 2.25-2.25v-9c0-1.243-1.007-2.25-2.25-2.25zM1.5 5.625c0-.414.336-.75.75-.75h1.125v1.125c0 .621.504 1.125 1.125 1.125s1.125-.504 1.125-1.125V4.875h7.5V6c0 .621.504 1.125 1.125 1.125S15.375 6.621 15.375 6V4.875h.375c.414 0 .75.336.75.75v2.25H1.5V5.625zM16.5 14.625c0 .414-.336.75-.75.75H2.25c-.414 0-.75-.336-.75-.75V9.375h15v5.25z"
                      fill=""
                    />
                    <path
                      d="M4.5 11.25h2.25c.414 0 .75-.336.75-.75s-.336-.75-.75-.75H4.5c-.414 0-.75.336-.75.75s.336.75.75.75zM9 11.25h4.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75H9c-.414 0-.75.336-.75.75s.336.75.75.75zM4.5 13.5h1.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75H4.5c-.414 0-.75.336-.75.75s.336.75.75.75z"
                      fill=""
                    />
                  </svg>
                  Orders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/products"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('products') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.75 3.375H14.625V2.25C14.625 1.629 14.121 1.125 13.5 1.125S12.375 1.629 12.375 2.25v1.125H5.625V2.25C5.625 1.629 5.121 1.125 4.5 1.125S3.375 1.629 3.375 2.25v1.125H2.25C1.007 3.375 0 4.382 0 5.625v9C0 15.868 1.007 16.875 2.25 16.875h13.5c1.243 0 2.25-1.007 2.25-2.25v-9c0-1.243-1.007-2.25-2.25-2.25zM1.5 5.625c0-.414.336-.75.75-.75h1.125v1.125c0 .621.504 1.125 1.125 1.125s1.125-.504 1.125-1.125V4.875h7.5V6c0 .621.504 1.125 1.125 1.125S15.375 6.621 15.375 6V4.875h.375c.414 0 .75.336.75.75v2.25H1.5V5.625zM16.5 14.625c0 .414-.336.75-.75.75H2.25c-.414 0-.75-.336-.75-.75V9.375h15v5.25z"
                      fill=""
                    />
                    <path
                      d="M4.5 11.25h2.25c.414 0 .75-.336.75-.75s-.336-.75-.75-.75H4.5c-.414 0-.75.336-.75.75s.336.75.75.75zM9 11.25h4.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75H9c-.414 0-.75.336-.75.75s.336.75.75.75zM4.5 13.5h1.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75H4.5c-.414 0-.75.336-.75.75s.336.75.75.75z"
                      fill=""
                    />
                  </svg>
                  Products
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/categories"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('categories') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.10352 0.351562H2.53516C1.40039 0.351562 0.462891 1.31611 0.462891 2.45088V6.01924C0.462891 7.15401 1.42744 8.09156 2.53516 8.09156H6.10352C7.23828 8.09156 8.20283 7.12701 8.20283 6.01924V2.45088C8.20283 1.31611 7.23828 0.351562 6.10352 0.351562ZM6.84375 6.01924C6.84375 6.38486 6.52734 6.70127 6.13086 6.70127H2.5625C2.19688 6.70127 1.88047 6.38486 1.88047 6.01924V2.45088C1.88047 2.08526 2.19688 1.76885 2.5625 1.76885H6.13086C6.49648 1.76885 6.8129 2.08526 6.8129 2.45088V6.01924H6.84375Z"
                      fill=""
                    />
                    <path
                      d="M15.4652 0.351562H11.8969C10.7621 0.351562 9.82461 1.31611 9.82461 2.45088V6.01924C9.82461 7.15401 10.7892 8.09156 11.8969 8.09156H15.4652C16.6 8.09156 17.5645 7.12701 17.5645 6.01924V2.45088C17.5645 1.31611 16.6 0.351562 15.4652 0.351562ZM16.2055 6.01924C16.2055 6.38486 15.889 6.70127 15.4926 6.70127H11.9242C11.5586 6.70127 11.2422 6.38486 11.2422 6.01924V2.45088C11.2422 2.08526 11.5586 1.76885 11.9242 1.76885H15.4926C15.859 1.76885 16.1754 2.08526 16.1754 2.45088V6.01924H16.2055Z"
                      fill=""
                    />
                    <path
                      d="M6.10352 9.7207H2.53516C1.40039 9.7207 0.462891 10.6853 0.462891 11.82V15.3884C0.462891 16.5231 1.42744 17.4607 2.53516 17.4607H6.10352C7.23828 17.4607 8.20283 16.4961 8.20283 15.3884V11.82C8.20283 10.6853 7.23828 9.7207 6.10352 9.7207ZM6.84375 15.3884C6.84375 15.754 6.52734 16.0704 6.13086 16.0704H2.5625C2.19688 16.0704 1.88047 15.754 1.88047 15.3884V11.82C1.88047 11.4544 2.19688 11.138 2.5625 11.138H6.13086C6.49648 11.138 6.8129 11.4544 6.8129 11.82V15.3884H6.84375Z"
                      fill=""
                    />
                    <path
                      d="M15.4652 9.7207H11.8969C10.7621 9.7207 9.82461 10.6853 9.82461 11.82V15.3884C9.82461 16.5231 10.7892 17.4607 11.8969 17.4607H15.4652C16.6 17.4607 17.5645 16.4961 17.5645 15.3884V11.82C17.5645 10.6853 16.6 9.7207 15.4652 9.7207ZM16.2055 15.3884C16.2055 15.754 15.889 16.0704 15.4926 16.0704H11.9242C11.5586 16.0704 11.2422 15.754 11.2422 15.3884V11.82C11.2422 11.4544 11.5586 11.138 11.9242 11.138H15.4926C15.859 11.138 16.1754 11.4544 16.1754 11.82V15.3884H16.2055Z"
                      fill=""
                    />
                  </svg>
                  Categories
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/subcategories"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('subcategories') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.25 4.5h13.5c.621 0 1.125-.504 1.125-1.125S16.371 2.25 15.75 2.25H2.25C1.629 2.25 1.125 2.754 1.125 3.375S1.629 4.5 2.25 4.5zM15.75 6.75H2.25C1.629 6.75 1.125 7.254 1.125 7.875s.504 1.125 1.125 1.125h13.5c.621 0 1.125-.504 1.125-1.125S16.371 6.75 15.75 6.75zM15.75 11.25H2.25c-.621 0-1.125.504-1.125 1.125s.504 1.125 1.125 1.125h13.5c.621 0 1.125-.504 1.125-1.125s-.504-1.125-1.125-1.125zM15.75 15.75H2.25c-.621 0-1.125.504-1.125 1.125s.504 1.125 1.125 1.125h13.5c.621 0 1.125-.504 1.125-1.125s-.504-1.125-1.125-1.125z"
                      fill=""
                    />
                  </svg>
                  SubCategories
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/profile"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('profile') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                      fill=""
                    />
                    <path
                      d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                      fill=""
                    />
                  </svg>{' '}
                  Profile
                </NavLink>
              </li>
            </ul>
          </div>

          {/* <!-- Others Group --> */}
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Auth Pages --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/auth' || pathname.includes('auth')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          (pathname === '/auth' || pathname.includes('auth')) &&
                          'bg-graydark dark:bg-meta-4'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="19"
                          viewBox="0 0 18 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_130_9814)">
                            <path
                              d="M12.7127 0.55835H9.53457C8.80332 0.55835 8.18457 1.1771 8.18457 1.90835V3.84897C8.18457 4.18647 8.46582 4.46772 8.80332 4.46772C9.14082 4.46772 9.45019 4.18647 9.45019 3.84897V1.88022C9.45019 1.82397 9.47832 1.79585 9.53457 1.79585H12.7127C13.3877 1.79585 13.9221 2.33022 13.9221 3.00522V15.0709C13.9221 15.7459 13.3877 16.2802 12.7127 16.2802H9.53457C9.47832 16.2802 9.45019 16.2521 9.45019 16.1959V14.2552C9.45019 13.9177 9.16894 13.6365 8.80332 13.6365C8.43769 13.6365 8.18457 13.9177 8.18457 14.2552V16.1959C8.18457 16.9271 8.80332 17.5459 9.53457 17.5459H12.7127C14.0908 17.5459 15.1877 16.4209 15.1877 15.0709V3.03335C15.1877 1.65522 14.0627 0.55835 12.7127 0.55835Z"
                              fill=""
                            />
                            <path
                              d="M10.4346 8.60205L7.62207 5.7333C7.36895 5.48018 6.97519 5.48018 6.72207 5.7333C6.46895 5.98643 6.46895 6.38018 6.72207 6.6333L8.46582 8.40518H3.45957C3.12207 8.40518 2.84082 8.68643 2.84082 9.02393C2.84082 9.36143 3.12207 9.64268 3.45957 9.64268H8.49395L6.72207 11.4427C6.46895 11.6958 6.46895 12.0896 6.72207 12.3427C6.83457 12.4552 7.00332 12.5114 7.17207 12.5114C7.34082 12.5114 7.50957 12.4552 7.62207 12.3145L10.4346 9.4458C10.6877 9.24893 10.6877 8.85518 10.4346 8.60205Z"
                              fill=""
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_130_9814">
                              <rect
                                width="18"
                                height="18"
                                fill="white"
                                transform="translate(0 0.052124)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        Authentication
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                            open && 'rotate-180'
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/auth/sign-in"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Sign In
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
