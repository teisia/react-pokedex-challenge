import React from 'react'
import ReactDOM from 'react-dom'

import Main from './views/main.jsx'

if (Meteor.isClient) {
    Meteor.startup(() => {
        ReactDOM.render(<Main />, document.getElementById('render-target'))
    })
}
