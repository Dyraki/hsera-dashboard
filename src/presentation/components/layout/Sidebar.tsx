import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { MenuNode } from '../../../core/domain/models/Management';
import { useCases } from '../../../core/di/container';
import { AppError } from '../../../core/domain/errors/AppError';

// Global in-memory cache to prevent menu flicker/refresh flash across page navigations
let cachedMenuTree: MenuNode[] | null = null;

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Menu data fetched from backend with instant cache initialization
  const [menuTree, setMenuTree] = useState<MenuNode[]>(() => cachedMenuTree || []);
  const [loadingMenus, setLoadingMenus] = useState<boolean>(() => !cachedMenuTree);
  const [unauthenticated, setUnauthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchMenus = async () => {
      // Only set loading if no cached data exists
      if (!cachedMenuTree) {
        setLoadingMenus(true);
      }
      try {
        cachedMenuTree = await useCases.manageMenus.navigationTree();
        if (mounted) {
          setMenuTree(cachedMenuTree);
          setUnauthenticated(false);
        }
      } catch (error) {
        console.error('Gagal mengambil menu:', error);
        if (error instanceof AppError && error.status === 401) {
          if (mounted) setUnauthenticated(true);
        }
      } finally {
        if (mounted) setLoadingMenus(false);
      }
    };
    fetchMenus();
    return () => { mounted = false; };
  }, []);

  // helper removed (not currently used)

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-black text-bodydark1 flex flex-col transition-all duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
    >
      {/* Sidebar Brand Header */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-gray-800/60">
        <div className="h-9 w-9 rounded-lg bg-primary-600 flex items-center justify-center text-white font-extrabold text-base shadow-xs">
          F
        </div>
        <div>
          <h1 className="font-bold text-base text-white tracking-tight leading-none">Framework V1</h1>
          <span className="text-[10px] text-gold-500 font-medium tracking-wide">ENTERPRISE SAAS</span>
        </div>
      </div>

      {/* Sidebar Navigation Items */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <nav className="space-y-1.5">
          {loadingMenus && menuTree.length === 0 && (
            <div className="px-4 py-2 text-sm text-slate-400">Memuat menu...</div>
          )}
          {unauthenticated && menuTree.length === 0 && (
            <div className="px-4 py-2 text-sm text-rose-500">Silakan masuk untuk melihat menu.</div>
          )}
          {!unauthenticated && !loadingMenus && menuTree.length === 0 && (
            <div className="px-4 py-2 text-sm text-slate-400">Tidak ada menu tersedia.</div>
          )}
          {!unauthenticated && menuTree.map((node) => (
            <MenuNodeItem key={node.id} node={node} navigate={navigate} setSidebarOpen={setSidebarOpen} location={location} />
          ))}
          <div className="pt-4 mt-4 border-t border-gray-800">
            <button
              onClick={() => {
                navigate('/design-system');
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-md font-medium text-xs transition-colors ${
                location.pathname === '/design-system'
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles size={14} className="text-gold-500" />
                <span>Design System UI</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-900 text-purple-200 border border-purple-700/50">
                v1
              </span>
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
};

// Helper to normalize path with leading slash
const normalizePath = (link?: string | null): string => {
  if (!link || link === '#') return '';
  return link.startsWith('/') ? link : `/${link}`;
};

// Recursive component to render a menu node and its children
const MenuNodeItem: React.FC<{
  node: MenuNode;
  navigate: (path: string) => void;
  setSidebarOpen: (open: boolean) => void;
  location: any;
}> = ({ node, navigate, setSidebarOpen, location }) => {
  const nodePath = normalizePath(node.link);
  const anyChild = !!(node.submenus && node.submenus.length > 0);

  // Check if any child route is active to auto-expand parent
  const hasActiveChild = (n: MenuNode): boolean => {
    if (!n.submenus || n.submenus.length === 0) return false;
    return n.submenus.some((child) => {
      const p = normalizePath(child.link);
      if (p && (location.pathname === p || location.pathname.startsWith(p + '/'))) {
        return true;
      }
      return hasActiveChild(child);
    });
  };

  const [open, setOpen] = useState<boolean>(() => hasActiveChild(node));

  const isActive = (): boolean => {
    if (!nodePath) return false;
    if (nodePath === '/') {
      return location.pathname === '/';
    }
    return location.pathname === nodePath || location.pathname.startsWith(nodePath + '/');
  };

  useEffect(() => {
    if (hasActiveChild(node)) {
      setOpen(true);
    }
  }, [location.pathname]);

  // If node has no children, render as direct clickable link
  if (!anyChild) {
    return (
      <button
        onClick={() => {
          if (nodePath) {
            navigate(nodePath);
            if (window.innerWidth < 1024) {
              setSidebarOpen(false);
            }
          }
        }}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg font-medium text-body-sm transition-colors ${
          isActive()
            ? 'bg-primary-600 text-white shadow-xs'
            : 'text-gray-400 hover:bg-gray-800/80 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-3">
          <span>{node.nama}</span>
        </div>
      </button>
    );
  }

  // Node with children -> dropdown group
  const isChildActive = hasActiveChild(node);

  return (
    <div className="space-y-1" key={node.id}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg font-medium text-body-sm transition-colors ${
          open || isChildActive
            ? 'bg-gray-900 text-white'
            : 'text-gray-400 hover:bg-gray-800/80 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-3">
          <span>{node.nama}</span>
        </div>
        {open ? (
          <ChevronUp size={15} className="text-gray-400" />
        ) : (
          <ChevronDown size={15} className="text-gray-400" />
        )}
      </button>

      {open && (
        <div className="pl-3 mt-1 space-y-1 border-l border-gray-800 ml-3">
          {node.submenus!.map((sub) => (
            <MenuNodeItem
              key={sub.id}
              node={sub}
              navigate={navigate}
              setSidebarOpen={setSidebarOpen}
              location={location}
            />
          ))}
        </div>
      )}
    </div>
  );
};
