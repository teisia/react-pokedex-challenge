import { observable, action, computed } from 'mobx'
import includes from 'lodash.includes'

class TableState {
    @observable selectedFilters = []
    @observable selectedCategory = null
    @observable searchValue = null

    @computed get selectedFilterValues() {
        return this.selectedFilters.map(f => f.filter)
    }

    @action setSelectedFilters = filter => {
        if (includes(this.selectedFilterValues, filter)) {
            this.selectedFilters = this.selectedFilters.filter(f => f.filter !== filter)
        } else {
            this.selectedFilters = [...this.selectedFilters, {type: this.selectedCategory, filter: filter}]
        }
    }

    @action clearFilters = () => {
        this.selectedFilters = []
    }

    @action setSelectedCategory = category => {
        this.selectedCategory = category
    }

    @action setSearchValue = value => {
        this.searchValue = value
    }
}

const singleton = new TableState()
export default singleton