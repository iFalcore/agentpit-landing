import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 * Scrolls to a section on the landing page, routing back to it first if the
 * viewer is on another page.
 *
 * The app uses HashRouter so it can be served from any static host — including
 * a single-file bundle — with no rewrite rules. That means the URL hash belongs
 * to the router, so in-page anchors have to scroll programmatically rather than
 * via href="#id", which the router would read as a route.
 */
export function useSectionNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return useCallback(
    (id: string) => {
      const scroll = () =>
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

      if (pathname !== '/') {
        navigate('/')
        // Wait for the landing page to mount before looking for the target.
        requestAnimationFrame(() => requestAnimationFrame(scroll))
      } else {
        scroll()
      }
    },
    [navigate, pathname],
  )
}
