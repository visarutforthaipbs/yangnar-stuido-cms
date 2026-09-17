export function ArrowIcon({direction = 'up-right'}: {direction?: 'up-right' | 'left' | 'right' | 'down'}) {
  const rotation = {'up-right': -45, left: 180, right: 0, down: 90}[direction]
  return <svg className="arrow-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><g transform={`rotate(${rotation} 12 12)`}><path d="M4 12h16M13 5l7 7-7 7" /></g></svg>
}
