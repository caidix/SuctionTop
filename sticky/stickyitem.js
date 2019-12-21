import React from 'react';
import { StickyContext } from './stickyContainer';

const hardwareAcceleration = { transform: 'translateZ(0)' };

class Sticky extends React.PureComponent {
  static contextType = StickyContext;
  constructor(props) {
    super(props)
    this.state = {
      style: {},
      placeholderHeight: 0,
    };
    this.container = React.createRef();
    this.placeholder = React.createRef();
    this.handelItemEvent = this.handelItemEvent.bind(this)
  }
  componentDidMount() {
    if (!this.context.addSubscribers) {
      throw new TypeError('stikyitem需要包裹在stickybody内使用!')
    }
    this.context.addSubscribers(this.handelItemEvent)
  }
  componentWillUnmount() {
    this.context.unSubscribers(this.handelItemEvent)
  }
  handelItemEvent({ offsetTop = 0, parentBottom }) {
    const { height, top } = this.container.current.getBoundingClientRect();
    const { width } = this.placeholder.current.getBoundingClientRect();
    // 包裹的container元素距离底部的高度。底部的高度减去需要吸顶的高度减去吸顶元素本身的高度
    // 即可得到当下拉至超出containner元素时，吸顶元素将保持固定至container元素底部而不跟随。
    const heightFromTop = parentBottom - offsetTop - height;
    if (top > 0) {
      this.setState({
        style: {
          transform: 'translateZ(0)'
        },
        placeholderHeight: 0
      })
    } else {
      this.setState({
        style: {
          transform: 'translateZ(0)',
          position: 'fixed',
          top: heightFromTop > 0 ? 0 + offsetTop : heightFromTop + offsetTop,
          width
        },
        placeholderHeight: height
      })
    }
  }
  componentWillMount() { }
  render() {
    const style = this.state.style;
    const height = this.state.placeholderHeight;
    return (
      <div ref={this.container}>
        <div ref={this.placeholder} style={{ height }}></div>
        {this.props.content(style)}
      </div>
    )
  }
}

export default Sticky;