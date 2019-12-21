import React from 'react';
import raf from 'raf';
const eventList = ['resize', 'scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'];

export const StickyContext = React.createContext({});

class StickyContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      currentTarget: window
    }
    this.PackagingBox = React.createRef();
    this.subscribers = [];
    // raf处理器
    this.rafHandle = null;
    this.handleEvent = this.handleEvent.bind(this);
  }

  componentDidMount() {
    eventList.forEach(event => {
      this.judgeTarget().target.addEventListener(event, this.handleEvent)
    })
  }

  componentWillUnmount() {
    if (this.rafHandle) {
      raf.cancel(this.rafHandle)
      this.rafHandle = null;
    }
    eventList.forEach(event => {
      this.judgeTarget().target.removeEventListener(event, this.handleEvent)
    })
  }

  judgeTarget() {
    if (this.state.currentTarget == window) {
      return {
        target: window,
        offsetTop: this.props.offsetTop ? this.props.offsetTop : 0
      }
    }
    let node = document.querySelector(this.state.currentTarget);
    return {
      target: node,
      offsetTop: this.props.offsetTop ? this.props.offsetTop : node.offsetTop
    }
  }

  addSubscribers = (event) => {
    this.subscribers = this.subscribers.concat(event)
  }

  unSubscribers = (event) => {
    this.subscribers = this.subscribers.filters(current => current !== event);
  }

  handleEvent() {
    this.rafHandle = raf(() => {
      const offsetTop = this.judgeTarget().offsetTop;
      const { bottom } = this.PackagingBox.current.getBoundingClientRect();
      this.subscribers.forEach(handle => {
        handle({
          offsetTop,
          parentBottom: bottom
        })
      })
    })
  }

  render() {
    const subscriberControl = {
      addSubscribers: this.addSubscribers,
      unSubscribers: this.unSubscribers
    }
    return (
      <StickyContext.Provider value={subscriberControl}>
        <div ref={this.PackagingBox}>
          {this.props.children}
        </div>
      </StickyContext.Provider>
    )
  }
}

export default StickyContainer;