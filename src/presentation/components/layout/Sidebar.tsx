import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { MenuNode } from '../../../core/domain/models/Management';
import { useCases } from '../../../core/di/container';
import { AppError } from '../../../core/domain/errors/AppError';
import hseraLogo from '../../assets/images/hsera-logo.png';
import { MenuIcon } from '../ui/MenuIcon';

// Global in-memory cache to prevent menu flicker across page navigations
let cachedMenuTree: MenuNode[] | null = null;

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

// Helper to normalize route path with leading slash
export const normalizePath = (link?: string | null): string => {
  if (!link || link === '#') return '';
  return link.startsWith('/') ? link : '/' + link;
};

// Check if any child route is active
export const hasActiveChildRoute = (node: MenuNode, pathname: string): boolean => {
  if (!node.submenus || node.submenus.length === 0) return false;
  return node.submenus.some((child) => {
    const p = normalizePath(child.link);
    if (p && (pathname === p || pathname.startsWith(p + '/'))) {
      return true;
    }
    return hasActiveChildRoute(child, pathname);
  });
};

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
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <aside
      className={`z-50 flex flex-col bg-[#160a34] text-bodydark1 border-r border-purple-950/60 shadow-2xl transition-[width,transform] duration-300 ease-in-out ${sidebarOpen
        ? 'w-72 max-w-[85vw] translate-x-0'
        : '-translate-x-full lg:translate-x-0 lg:w-20'
        } fixed inset-y-0 left-0 lg:relative lg:shrink-0 h-full`}
    >
      {/* Floating Circular Toggle Button on the Right Edge (Desktop only) */}
      <button
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        title={sidebarOpen ? 'Perkecil sidebar' : 'Perluas sidebar'}
        aria-label={sidebarOpen ? 'Perkecil sidebar' : 'Perluas sidebar'}
        className="hidden lg:flex absolute -right-3.5 top-6 z-40 w-7 h-7 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 items-center justify-center shadow-lg ring-2 ring-[#160a34] transition-all hover:scale-110 active:scale-95 cursor-pointer font-bold"
      >
        {sidebarOpen ? (
          <ChevronLeft size={16} className="stroke-[2.5]" />
        ) : (
          <ChevronRight size={16} className="stroke-[2.5]" />
        )}
      </button>

      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-4 border-b border-purple-950/80 shrink-0">
        {sidebarOpen ? (
          <div className="flex items-center justify-between w-full min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={hseraLogo}
                alt="HSERA Logo"
                className="h-10 w-10 object-contain select-none shrink-0 drop-shadow-md"
              />
              <div className="truncate">
                <h1 className="font-bold text-[15px] text-white tracking-tight leading-none truncate">
                  HSERA PLATFORM
                </h1>
                <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase mt-0.5 block">
                  AO Tulungagung
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              title="Tutup menu navigasi"
              aria-label="Tutup menu navigasi"
              className="lg:hidden p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-primary-600 transition-colors shrink-0 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          /* Collapsed Mini Brand Header */
          <div className="w-full flex items-center justify-center">
            <img
              src={hseraLogo}
              alt="HSERA Logo"
              className="h-10 w-10 object-contain select-none drop-shadow-md hover:scale-110 transition-transform cursor-pointer"
              onClick={() => setSidebarOpen(true)}
              title="HSERA Platform - Klik untuk memperluas"
            />
          </div>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 custom-scrollbar">
        <nav className="space-y-1.5">
          {loadingMenus && menuTree.length === 0 && (
            <div className="px-3 py-2 text-xs text-purple-300/60 text-center">
              {sidebarOpen ? 'Memuat menu...' : '...'}
            </div>
          )}
          {unauthenticated && menuTree.length === 0 && (
            <div className="px-3 py-2 text-xs text-rose-400 text-center font-medium">
              {sidebarOpen ? 'Silakan masuk.' : '!'}
            </div>
          )}
          {!unauthenticated && !loadingMenus && menuTree.length === 0 && (
            <div className="px-3 py-2 text-xs text-purple-300/60 text-center">
              {sidebarOpen ? 'Tidak ada menu tersedia.' : '-'}
            </div>
          )}

          {!unauthenticated &&
            menuTree.map((node) =>
              sidebarOpen ? (
                <ExpandedMenuNodeItem
                  key={node.id}
                  node={node}
                  navigate={navigate}
                  setSidebarOpen={setSidebarOpen}
                  location={location}
                />
              ) : (
                <CollapsedMenuItem
                  key={node.id}
                  node={node}
                  navigate={navigate}
                  setSidebarOpen={setSidebarOpen}
                  location={location}
                />
              )
            )}
        </nav>
      </div>
    </aside>
  );
};

// =========================================================================
// COLLAPSED RAIL MODE ITEM (Portal Tooltip & Portal Flyout Submenu)
// Bypasses parent overflow clipping completely by rendering via React Portal
// =========================================================================

interface CollapsedMenuItemProps {
  node: MenuNode;
  navigate: (path: string) => void;
  setSidebarOpen: (open: boolean) => void;
  location: any;
}

const CollapsedMenuItem: React.FC<CollapsedMenuItemProps> = ({
  node,
  navigate,
  setSidebarOpen,
  location,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<any>(null);

  const nodePath = normalizePath(node.link);
  const hasChildren = !!(node.submenus && node.submenus.length > 0);
  const isChildActive = hasActiveChildRoute(node, location.pathname);

  const isActive = (): boolean => {
    if (!nodePath) return false;
    if (nodePath === '/' || nodePath === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === nodePath || location.pathname.startsWith(nodePath + '/');
  };

  const active = isActive();
  const highlighted = active || isChildActive;

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top,
        left: rect.right + 10,
      });
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    updatePosition();
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  };

  const handleFlyoutMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovered(true);
  };

  const handleFlyoutMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className="relative flex justify-center py-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (!hasChildren && nodePath) {
            navigate(nodePath);
            setIsHovered(false);
            if (window.innerWidth < 1024) setSidebarOpen(false);
          }
        }}
        title={node.nama}
        aria-label={node.nama}
        className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${highlighted
          ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/40 ring-2 ring-primary-400/50 scale-105'
          : 'text-purple-200/80 hover:bg-primary-600 hover:text-white hover:scale-105'
          }`}
      >
        <MenuIcon
          icon={node.icon}
          name={node.nama}
          size={20}
          className={highlighted ? 'text-white' : 'text-purple-200/90 group-hover:text-white'}
        />
      </button>

      {/* Portal Tooltip for Leaf Item */}
      {!hasChildren &&
        isHovered &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: coords.top + 8,
              left: coords.left,
              zIndex: 9999,
            }}
            className="px-3 py-1.5 bg-[#180d32] text-white text-xs font-semibold rounded-lg shadow-2xl border border-primary-900/80 whitespace-nowrap pointer-events-none transition-opacity"
          >
            {node.nama}
          </div>,
          document.body
        )}

      {/* Portal Flyout Popover for Group with Submenus */}
      {hasChildren &&
        isHovered &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            onMouseEnter={handleFlyoutMouseEnter}
            onMouseLeave={handleFlyoutMouseLeave}
            style={{
              position: 'fixed',
              top: Math.max(12, Math.min(coords.top, window.innerHeight - 340)),
              left: coords.left,
              zIndex: 9999,
            }}
            className="min-w-[220px] max-w-[280px] bg-[#180d32] border border-primary-900/80 rounded-xl shadow-2xl py-2 px-1 text-white transition-all animate-fadeIn"
          >
            <div className="px-3 py-2 border-b border-primary-900/60 mb-1 flex items-center gap-2">
              <MenuIcon icon={node.icon} name={node.nama} size={15} className="text-amber-400" />
              <span className="font-bold text-xs text-white uppercase tracking-wider truncate">
                {node.nama}
              </span>
            </div>
            <div className="space-y-0.5 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {node.submenus!.map((sub) => {
                const subPath = normalizePath(sub.link);
                const isSubActive =
                  subPath &&
                  (location.pathname === subPath || location.pathname.startsWith(subPath + '/'));
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => {
                      if (subPath) {
                        navigate(subPath);
                        setIsHovered(false);
                        if (window.innerWidth < 1024) setSidebarOpen(false);
                      }
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${isSubActive
                      ? 'bg-primary-600 text-white font-bold shadow-xs'
                      : 'text-purple-200/90 hover:bg-primary-600 hover:text-white'
                      }`}
                  >
                    <MenuIcon icon={sub.icon} name={sub.nama} size={15} />
                    <span className="truncate">{sub.nama}</span>
                  </button>
                );
              })}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

// =========================================================================
// EXPANDED MODE ITEM (Full Accordion Menu)
// =========================================================================

interface ExpandedMenuNodeItemProps {
  node: MenuNode;
  isSubmenu?: boolean;
  navigate: (path: string) => void;
  setSidebarOpen: (open: boolean) => void;
  location: any;
}

const ExpandedMenuNodeItem: React.FC<ExpandedMenuNodeItemProps> = ({
  node,
  isSubmenu = false,
  navigate,
  setSidebarOpen,
  location,
}) => {
  const nodePath = normalizePath(node.link);
  const hasChildren = !!(node.submenus && node.submenus.length > 0);
  const isChildActive = hasActiveChildRoute(node, location.pathname);

  const isActive = (): boolean => {
    if (!nodePath) return false;
    if (nodePath === '/' || nodePath === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === nodePath || location.pathname.startsWith(nodePath + '/');
  };

  const [open, setOpen] = useState<boolean>(() => isChildActive);

  useEffect(() => {
    if (isChildActive) {
      setOpen(true);
    }
  }, [location.pathname, isChildActive]);

  const active = isActive();

  // Leaf item (No children)
  if (!hasChildren) {
    return (
      <button
        type="button"
        onClick={() => {
          if (nodePath) {
            navigate(nodePath);
            if (window.innerWidth < 1024) setSidebarOpen(false);
          }
        }}
        className={`w-full flex items-center justify-between transition-all duration-200 cursor-pointer ${isSubmenu
          ? `px-3 py-2 rounded-lg text-[13px] font-medium ${active
            ? 'bg-primary-600 text-white font-semibold shadow-sm shadow-primary-600/30'
            : 'text-purple-200/80 hover:bg-primary-600 hover:text-white hover:translate-x-1'
          }`
          : `px-3.5 py-2.5 rounded-xl text-[14px] font-semibold tracking-wide ${active
            ? 'bg-primary-600 text-white font-bold shadow-md shadow-primary-600/40 ring-1 ring-primary-500/50'
            : 'text-purple-100 hover:bg-primary-600 hover:text-white hover:shadow-sm hover:shadow-primary-600/20'
          }`
          }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <MenuIcon
            icon={node.icon}
            name={node.nama}
            size={isSubmenu ? 15 : 19}
            className={`${active
              ? 'text-white shrink-0 drop-shadow-xs'
              : 'text-purple-200/80 shrink-0 group-hover:text-white'
              }`}
          />
          <span className="truncate">{node.nama}</span>
        </div>
      </button>
    );
  }

  // Group with Children (Accordion)
  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14px] font-semibold tracking-wide transition-all duration-200 cursor-pointer ${open || isChildActive
          ? 'bg-primary-900/40 text-white border-l-[3px] border-primary-500 shadow-xs'
          : 'text-purple-100 hover:bg-primary-600 hover:text-white'
          }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <MenuIcon
            icon={node.icon}
            name={node.nama}
            size={19}
            className={`${isChildActive || open
              ? 'text-primary-400 shrink-0'
              : 'text-purple-200/80 shrink-0'
              }`}
          />
          <span className="truncate">{node.nama}</span>
        </div>
        {open ? (
          <ChevronUp size={16} className="text-purple-200/80 shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-purple-200/80 shrink-0" />
        )}
      </button>

      {open && (
        <div className="pl-3.5 ml-4 mt-1.5 space-y-1 border-l-2 border-primary-600/30">
          {node.submenus!.map((sub) => (
            <ExpandedMenuNodeItem
              key={sub.id}
              node={sub}
              isSubmenu={true}
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
