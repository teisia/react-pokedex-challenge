import { observable, action } from 'mobx'

class PokemonState {
    @observable filters = {
        type: [],
        weaknesses: []
    }
    
    @action setFilter = (type, value) => {
        switch(type) {
            case 'type':
                value.map(v => {
                    this.filters.type.push(v)
                })
            break
            case 'weaknesses':
                value.map(v => {
                    this.filters.weaknesses.push(v)
                })
            break
        }
    }
}

const singleton = new PokemonState()
export default singleton