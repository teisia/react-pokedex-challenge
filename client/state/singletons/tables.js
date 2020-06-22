import { observable, action, computed } from 'mobx'

class TableState {
    @observable searchValue = null

    @action setSearchValue = value => {
        this.searchValue = value
    }
}

const singleton = new TableState()
export default singleton