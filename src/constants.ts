import { ICompany } from "./models";

export const COMPANIES: ICompany[] = [
    {
        id: 'td',
        name: 'TD Bank',
        description: '',
        imageURL: 'https://png.pngitem.com/pimgs/s/234-2349342_td-canada-trust-logo-png-transparent-png.png',
    },
    {
        id: 'cibc',
        name: 'CIBC',
        description: '',
        imageURL: 'https://mma.prnewswire.com/media/1632139/CIBC_CIBC_unveils_new_look_symbolizing_the_bank_s_purpose_of_hel.jpg?p=facebook',
    },
    {
        id: 'hsbc',
        name: 'HSBC',
        description: '',
        imageURL: 'https://www.shutterstock.com/image-vector/hsbc-bank-logo-vector-editorial-260nw-2361510123.jpg',
    },
    {
        id: 'rbc',
        name: 'RBC',
        description: '',
        imageURL: 'https://abbylui.com/Images/RBCBanner.png',
    },
    {
        id: 'bmo',
        name: 'BMO',
        description: '',
        imageURL: 'https://logos-world.net/wp-content/uploads/2021/03/Bank-of-Montreal-Logo.png',
    },
    {
        id: 'scotiabank',
        name: 'Scotiabank',
        description: '',
        imageURL: 'https://magneticmediatv.com/wp-content/uploads/2014/11/image4.jpg',
    },
    {
        id: 'amex',
        name: 'American Express',
        description: '',
        imageURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4kC0xSqJFqWEvEbrBcRbWuNQi_cu2qYIcFw&usqp=CAU'
    }
]

export enum ECardType {
    CASHBACK = 'CASHBACK',
    POINTS = 'POINTS'
}