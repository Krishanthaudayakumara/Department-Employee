import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import {
    Building2,
  CodeSquare,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Music2Icon,
  Settings,
  Users2,
  VideoIcon,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';


const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    to: '/dashboard',
    color: 'text-red-400',
  },
  {
    label: 'Employees',
    icon: Users2,
    to: '/employees',
    color: 'text-red-500',
  },
  {
    label: 'Departments',
    icon: Building2,
    to: '/departments',
    color: 'text-red-400',
  },
  {
    label: 'Settings',
    icon: Settings,
    to: '/settings',
    color: 'text-red-500',

  },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-8 my-2 flex-1">
        <Link to="/dashboard" className="flex items-center pl-3 mb-14">
          {/* <div className="relative w-8 h-8 mr-4">
            <img src="/logo.png" alt="logo" className="w-100 h-100" />
          </div> */}
          <h1 className={cn('text-2xl font-bold')}>
            Employee System
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.label}
              to={route.to}
              className={cn(
                'flex items-center p-2 rounded-lg hover:bg-gray-700 hover:text-white transition',
                location.pathname === route.to
                  ? 'bg-white/10 text-white'
                  : 'text-gray-300'
              )}
            >
              <route.icon className={cn(route.color, 'mr-2')} />
              <span className="ml-3">{route.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
