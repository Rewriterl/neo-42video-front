import About from './about.routes'
import Comic from './comic.routes'
import Contact from './contact.routes'
import Essay from './essay.routes'
import Home from './home.routes'
import Listen from './listen.routes'
import Login from './login.routes'
import Picture from './picture.routes'
import Study from './study.routes'
import User from './user.routes'
import CodePen from './codepen.routes'

export default [
  About,
  Comic,
  Contact,
  Essay,
  Home,
  Listen,
  Login,
  Picture,
  Study,
  ...User,
  CodePen
]
