import {connect} from 'react-redux'

import Panel from './Panel'

const mapStateToProps = (state) => ({
  trees: state.trees
})

export default connect(
  mapStateToProps
)(Panel)
