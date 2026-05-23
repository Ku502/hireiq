import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('HireIQ Error Boundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-base flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-brand-red/10 border border-brand-red/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-brand-red text-2xl">!</span>
            </div>
            <h1 className="font-display font-bold text-2xl tracking-tight mb-2">
              Something went wrong
            </h1>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="btn-primary text-sm py-2 px-6">
                Try again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="btn-ghost text-sm py-2 px-6">
                Go home
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
