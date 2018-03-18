import { ISelectItem } from '../interfaces/selectItem';
import STATES from '../database/states';
import { defaultAddress } from '../settings';

export class AddressService {
  private states: ISelectItem[];

  constructor(defaultState: string, private defaultCity: string) {
    this.states = [
      { value: null, display: 'Não informado' },
      STATES.filter(s => s.code === defaultState).map(state => {
        return { value: state.code, display: state.name };
      })[0],
      ...STATES.filter(s => s.code !== defaultState).map(state => {
        return { value: state.code, display: state.name };
      })
    ];
  }

  public getStates(): ISelectItem[] {
    return this.states;
  }

  public getCities(stateCode: string = null): ISelectItem[] {
    return [
      { value: null, display: stateCode ? 'Não informado' : 'Selecione o estado' },
      ...(STATES.filter(state => state.code === stateCode).map(state => {
        return [
          ...state.cities.filter(c => c === this.defaultCity).map(city => {
            return { value: city, display: city };
          }),
          ...state.cities.filter(c => c !== this.defaultCity).map(city => {
            return { value: city, display: city };
          })
        ];
      })[0] || [])
    ];
  }

}

const addressService = new AddressService(defaultAddress.state, defaultAddress.city);
export default addressService;