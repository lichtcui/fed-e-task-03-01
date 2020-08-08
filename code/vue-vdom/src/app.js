import { init, h } from 'snabbdom'
import { classModule } from 'snabbdom/modules/class'
import { propsModule } from 'snabbdom/modules/props'
import { styleModule } from 'snabbdom/modules/style'
import { eventListenersModule } from 'snabbdom/modules/eventlisteners'

const patch = init([classModule, propsModule, styleModule, eventListenersModule])
const originalData = new Array(10).fill(0).map((i, index) => ({
  rank: index + 1,
  title: `The Shawshank Redemption ${index + 1}`,
  desc: `${index + 1} imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.`,
  elmHeight: 0
}))

let vnode
let data = originalData.slice(0, 3)
let sortBy = 'rank'
let nextRank = 11

const buttonView = button => h('a.btn',{ on: { click: [changeSort, button] }}, button)

const movieView = movie => h('div.row', {
  key: movie.rank,
  style: {
    opacity: '0',
    transform: 'translate(-200px)',
    delayed: { transform: `translateY(${movie.offset}px)`, opacity: '1' },
    remove: { opacity: '0', transform: `translateY(${movie.offset}px) translateX(200px)` }
  },
  hook: { insert: vnode => { movie.elmHeight = vnode.elm.offsetHeight } },
}, [
  h('div', { style: { fontWeight: 'bold', 'justify-self': 'center' } }, movie.rank),
  h('div', movie.title),
  h('div', movie.desc),
  h('a.btn.rm', { on: { click: [remove, movie] } }, 'x'),
])

const view = data => h('div', [
  h('h1', 'Top 10 movies'),
  h('div.buttons', [
    h('span', { style: { marginRight: '10px' } }, 'Sort by: '),
    h('div', ['rank', 'title', 'desc'].map(buttonView)),
    h('a.btn.add', { style: { marginLeft: 'auto' }, on: { click: add } }, 'Add'),
  ]),
  h('div.list', data.map(movieView)),
])

const changeSort = prop => {
  sortBy = prop
  data.sort((a, b) => a[prop] > b[prop] ? 1 : (a[prop] < b[prop] ? -1 : 0))
  render()
}

const add = () => {  
  const newMovie = originalData[Math.floor(Math.random() * 10)]
  data = [{ rank: nextRank++, title: newMovie.title, desc: newMovie.desc, elmHeight: 0 }, ...data]
  render()
  render()
}

const remove = movie => {
  data = data.filter(m => m !== movie)
  render()
}

const render = () => {
  const margin = 16
  data = data.reduce((acc, m) => {
    const last = acc[acc.length - 1]
    m.offset = last ? last.offset + last.elmHeight + margin : margin
    return acc.concat(m)
  }, [])
  vnode = patch(vnode, view(data))
}

window.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app')
  vnode = patch(app, view(data))
  render()
})