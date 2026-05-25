import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 * Synchronise l'URL React Router avec celle du parent (thème Shopify)
 * quand l'app est chargée dans une iframe.
 *
 * Flow :
 *  1. Au mount → le parent envoie le path actuel via postMessage,
 *     on navigue dessus pour matcher l'URL visible du navigateur.
 *  2. À chaque navigation React → on envoie le nouveau path au parent,
 *     qui met à jour son URL via history.pushState.
 *  3. Si l'user clique "back" dans le navigateur → le parent envoie
 *     le path précédent, on re-navigue côté React.
 *
 * Si l'app n'est PAS dans une iframe (accès direct à kpopshop.netlify.app),
 * tout ce code est inactif — aucune action, aucun appel postMessage.
 */
const normalizeIncomingPath = (path) => {
  if (!path || typeof path !== 'string') return '/'
  // Shopify ne peut pas servir /product/... au refresh.
  // Le thème utilise donc /#/product/... et l'iframe reconvertit vers /product/...
  if (path.startsWith('/#/')) return path.slice(2)
  if (path.startsWith('#/')) return path.slice(1)
  return path.startsWith('/') ? path : `/${path}`
}

export function useUrlSync() {
  const location = useLocation()
  const navigate = useNavigate()
  const lastSentPath = useRef(null)
  const isIframed = useRef(false)

  // Détection iframe une seule fois au mount
  useEffect(() => {
    try {
      isIframed.current = window.top !== window.self
    } catch {
      // Cross-origin parent → on est forcément dans une iframe
      isIframed.current = true
    }
  }, [])

  // 1. Au mount, demande au parent son path actuel
  useEffect(() => {
    if (!isIframed.current) return
    try {
      window.parent.postMessage(
        { type: 'kpopshop:ready', source: 'react-app' },
        '*'
      )
    } catch {
      // ignore
    }
  }, [])

  // 2. À chaque navigation React → notifie le parent
  useEffect(() => {
    if (!isIframed.current) return
    const path = location.pathname + location.search + location.hash
    if (path === lastSentPath.current) return
    lastSentPath.current = path
    try {
      window.parent.postMessage(
        { type: 'kpopshop:route-change', path, source: 'react-app' },
        '*'
      )
    } catch {
      // ignore
    }
  }, [location])

  // 3. Écoute les messages du parent (initial path + popstate)
  useEffect(() => {
    if (!isIframed.current) return
    const handler = (event) => {
      const msg = event.data
      if (!msg || msg.source === 'react-app') return // ignore nos propres messages

      // Le parent nous dit où aller (init au mount OU popstate)
      if (
        msg.type === 'kpopshop:navigate' &&
        typeof msg.path === 'string' &&
        msg.path
      ) {
        const targetPath = normalizeIncomingPath(msg.path)
        const currentPath =
          location.pathname + location.search + location.hash
        if (targetPath !== currentPath) {
          lastSentPath.current = targetPath
          navigate(targetPath, { replace: msg.replace !== false })
        }
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [navigate, location])
}
