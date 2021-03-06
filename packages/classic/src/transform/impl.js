'use strict'

import * as R from 'ramda'

import { data, zip } from '@skele/core'

import { memoize } from '../impl/util'

const { postWalk, root, value } = zip
const { flow, kindOf } = data

export function transformer(registry, elementZipper) {
  const elementTransformer = memoize(kind =>
    registry
      .get(kind)
      .reduce((f, g) => (x, context) => g(f(x, context), context), R.identity)
  )

  const transform = context => el => elementTransformer(kindOf(el))(el, context)

  return (el, context = {}) =>
    flow(el, elementZipper, postWalk(transform(context)), root, value)
}
