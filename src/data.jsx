/* central content — edit this file to update the site */

/* generated thumbnail for the project without a YouTube still */
function makeLabel(text, bg) {
  if (typeof document === 'undefined') return ''
  const c = document.createElement('canvas')
  c.width = 1280; c.height = 720
  const x = c.getContext('2d')
  x.fillStyle = bg; x.fillRect(0, 0, 1280, 720)
  x.fillStyle = 'rgba(255,255,255,0.10)'
  for (let yy = 0; yy < 720; yy += 44) for (let xx = 0; xx < 1280; xx += 44) { x.beginPath(); x.arc(xx, yy, 3, 0, 7); x.fill() }
  x.fillStyle = '#fff'; x.font = 'bold 120px Arial'; x.textAlign = 'center'; x.textBaseline = 'middle'
  x.fillText(text, 640, 360)
  return c.toDataURL('image/png')
}
const STEEL_WING = makeLabel('STEEL WING', '#2B49D4')

/* yt = YouTube ID for the in-site theater player; entries without one open their link externally */
export const SCREENS = [
  { thumb: '/thumbs/documentary.jpg', title: 'Documentary Style', tag: 'Documentary', yt: 'E8oQgbBqdS4', link: 'https://www.youtube.com/watch?v=E8oQgbBqdS4' },
  { thumb: '/thumbs/ayush.jpg', title: 'Ayush More', tag: 'Gaming', yt: 'ENG8HICI3Co', link: 'https://www.youtube.com/watch?v=ENG8HICI3Co' },
  { thumb: '/thumbs/agnit.jpg', title: 'Agnit Plays', tag: 'Gaming', yt: 'F5yZ0MtIulA', link: 'https://www.youtube.com/watch?v=F5yZ0MtIulA' },
  { thumb: '/thumbs/ravi.jpg', title: 'Ravi Plays', tag: 'Gaming', yt: 'sAfkdLDxWUI', link: 'https://www.youtube.com/watch?v=sAfkdLDxWUI' },
  { thumb: '/thumbs/bixuu.jpg', title: 'Bixuu', tag: 'Gaming', yt: 'Dsd6RbKVh7o', link: 'https://www.youtube.com/watch?v=Dsd6RbKVh7o' },
  { thumb: STEEL_WING, title: 'Steel Wing', tag: 'Gaming', link: 'https://drive.google.com/file/d/1cgE9iVwKC2ykgguoP3vaGJdwm-32gCcG/view' },
  { thumb: '/thumbs/ayush2.jpg', title: 'Ayush More 2.0', tag: 'Horror', yt: 'i5laiQGK6ys', link: 'https://www.youtube.com/watch?v=i5laiQGK6ys' },
]

export const SKILLS = [
  { name: 'Premiere Pro', pct: 95, desc: 'My main weapon — timelines, multicam, audio sync, colour & final delivery.' },
  { name: 'After Effects', pct: 88, desc: 'Motion graphics, titles, VFX & compositing for that cinematic edge.' },
]

export const SERVICES = [
  { n: '01', title: 'Documentary Editing', desc: 'Real stories told with intention — interview pacing, archival weaving & emotional rhythm.' },
  { n: '02', title: 'Gaming Montages', desc: 'High-energy, beat-synced edits built for impact. Dynamic cuts that make clips go viral.' },
  { n: '03', title: 'Color & VFX', desc: 'Cinematic colour grading & motion graphics that elevate footage to breathtaking.' },
]

export const CLIENTS = ['Ayush More', 'Agnit Plays', 'Ravi Plays', 'Bixuu']

export const STATS = [
  { value: '50+', label: 'Projects' },
  { value: '2+', label: 'Years' },
  { value: '10M+', label: 'Views' },
]

export const EMAIL = 'meetuedits21@gmail.com'

export const SOCIALS = [
  {
    name: 'X / Twitter', href: 'https://x.com/Meetu2169',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z',
  },
  {
    name: 'YouTube', href: 'https://www.youtube.com/watch?v=E8oQgbBqdS4',
    path: 'M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.6 15.6V8.4L15.83 12 9.6 15.6z',
  },
  {
    name: 'Instagram', href: 'https://www.instagram.com/',
    path: 'M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z',
  },
]
