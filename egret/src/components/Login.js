/* globals localStorage */
import App from '../App.js'
import React from 'react'
// import 'tachyons'
import { getToken, getCards } from './Api'
import { Redirect, Link } from 'react-router-dom'

class Login extends React.Component {
  constructor () {
    super()
    this.state = {
      username: localStorage.getItem('login_username') || '',
      password: '',
      token: localStorage.getItem('login_auth_token'),
      error: null,
      cards: [],
      currentCard: null,
      redirect: false
    }

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.currentCard = this.currentCard.bind(this)
  }

  componentDidMount () {
    if (this.state.token) {
      getCards(this.state.token).then(cards => this.setState({ cards: cards }))
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.token && this.state.token !== prevState.token) {
      getCards(this.state.token).then(cards => this.setState({ cards: cards }))
    }
  }

  currentCard (card) {
    this.setState({ currentCard: card })
  }

  handleLogin (event) {
    event.preventDefault()

    getToken(this.state.username, this.state.password)
      .then(token => {
        this.setState({ token: token, password: '' })
        localStorage.setItem('login_username', this.state.username)
        localStorage.setItem('login_auth_token', token)
        this.setState({ redirect: true })
      })

      .catch(error => {
        this.setState({ error: 'there is no such username or pw' })
        console.log(error)
      })
  }

  handleLogout (event) {
    event.preventDefault()

    this.setState({ token: null, username: '' })
    localStorage.removeItem('login_username')
    localStorage.removeItem('login_auth_token')
  }

  render () {
    if (this.state.redirect) {
      return (<Redirect to='/cards/all/' />)
    }

    return (
      <div className=''>
        {
          this.state.token
            ? (
              <div>
                <h3>welcome, {this.state.username}</h3>
                <Link to='/login'>
                <button onClick={this.handleLogout}>Logout</button>
                </Link>
                {/* <ul>
                  <article className='center mw5 mw6-ns br3 hidden ba b--black-10 mv4'>
                    <h1 className='center f4 bg-near-white br3 br--top black-60 mv0 pv2 ph3'>your Egrets</h1>
                    <div className='center pa3 bt b--black-10'>
                      <p className='f6 f5-ns lh-copy measure'>
                        {this.state.cards.map(card =>
                          <li
                            className='card pa3 bt b--black-10'
                            key={card.id}
                          >{card.message}
                          </li>)}
                      </p>
                    </div>
                  </article>
                </ul> */}

              </div>
            )
            : (
              <form onSubmit={this.handleLogin}>
                <div className='red'>{this.state.error}</div>
                <div className=''>
                  <label htmlFor='username' className=''>Username</label>
                  <input
                    id='username' className=''
                    type='text' value={this.state.username}
                    onChange={event => this.setState({ username: event.target.value })}
                  />
                </div>

                <div className=''>
                  <label htmlFor='password' className=''>Password</label>
                  <input
                    id='password' className=''
                    type='password' value={this.state.password}
                    onChange={event => this.setState({ password: event.target.value })}
                  />
                </div>
              
                <div className=''>
                <Link to='/cards/all/'>
                  <button 
                    type='submit' 
                    onClick='handleLogin' 
                    className=''>login</button>
                  </Link>
                </div>
              </form>
            )
        }
        <div />
      </div>
    )
  }
}
export default Login
