# react-SuctionTop

## 简易react吸顶方案

### 不支持ssr渲染

- 引入index.js(StickyContainer和Sticky)
- StickyContainer需要包裹住Sticky
- StickyContainer可引入参数oppsetTop

### 使用方式：


``` <StickyBody.StickyContainer currentTarget='.layout-scroll-view'>
            <HeaderView>ReactSticky page {index}</HeaderView>
            <StickyBody.Sticky>
              {({ style }) => <StickyHeaderView style={style}>吸顶{index}</StickyHeaderView>}
            </StickyBody.Sticky>
            <SectionView>123123</SectionView>
          </StickyBody.StickyContainer>
```

## touchMove拉动模块

- 参数： width：拉伸宽度， direction：left/right(目前只支持两种)