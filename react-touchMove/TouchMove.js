import React, { Component } from 'react'

class TouchMove extends React.PureComponent {
  constructor(props) {
    super(props)
    this.touchItem = React.createRef()
    this.state = {
      width: this.props.width ? this.props.width : 100,
      direction: this.props.direction ? this.props.direction : 'left'
    }
    this.touchEvent = this.touchEvent.bind(this)
  }
  componentDidMount() {
    this.touchEvent()
  }
  touchEvent() {
    const item = this.touchItem.current;
    const { height, width } = item.getBoundingClientRect()

    if (width < this.state.width) {
      throw new TypeError('拉伸宽度不能大于自身父元素宽度')
    }

    let offsetX = 0;
    item.addEventListener('touchstart', (ev) => {
      let { clientX: startX } = ev.changedTouches[0];
      // 每次事件触发时元素的起始位置都可能不尽相同
      startX = startX - offsetX;
      item.className = 'touchmove'
      const eventMove = (e1) => {
        const { clientX } = e1.changedTouches[0];
        // offsetX为移动的偏差量
        offsetX = clientX - startX;
        switch (this.state.direction) {
          case 'left': if (offsetX > 0 && offsetX < this.state.width) {
            item.style.left = offsetX + 'px'
          }; break;
        }
      }
      item.addEventListener('touchmove', eventMove);
      const eventEnd = (e2) => {
        // 增加滑动动画，使在拉伸结束时未在最后或是开始时自动移动时有移动效果
        item.className = 'touchmove active'
        // 根据传输的中间值判断移动路径
        let touchWidth = Math.floor(this.state.width / 2)
        if (offsetX > touchWidth) {
          offsetX = this.state.width;
          item.style.left = this.state.width + 'px'
        } else {
          offsetX = 0;
          item.style.left = 0;
        }
        item.removeEventListener('touchmove', eventMove);
        item.removeEventListener('touchend', eventEnd);
      }
      item.addEventListener('touchend', eventEnd);
    })
  }

  render() {
    return (
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <div ref={this.touchItem} style={{ position: 'relative', width: '100%', zIndex: 2 }}>
          {this.props.children}
        </div>
        <style>
          {
            `
            .touchmove {
              &.active {
                transition: 200ms;
              }
            }
            `
          }
        </style>
      </div>
    )
  }
}

export default TouchMove;
