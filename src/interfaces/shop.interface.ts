import { iPosition } from './position.interface';

export interface iShop {
    ID: string,
    OWNER: string,
    DATE_CREATE: string,
    LOCATION: iPosition,
    NAME: string,
    KIND: string,
    ADDRESS: string
    IMAGE: string,
    PHONE?: string,
    isCREDIT: boolean,
    isMOTO_PARK_FREE: boolean,
    isCAR_PARK_FREE: boolean,
    isMEMBERSHIP: boolean,
    isVISIBLE: boolean

}