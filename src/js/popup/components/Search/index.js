import {connect} from 'react-redux'

import Search from './Search'
import {updateTreesBySearchKeyword} from '../../actions'

const mapDispatchToProps = {
  updateTreesBySearchKeyword
}

const mapStateToProps = (state) => ({
  options: state.options,
  searchKeyword: state.searchKeyword
})

export default connect(mapStateToProps, mapDispatchToProps)(Search)
