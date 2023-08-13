import { FiMove } from 'react-icons/fi';
import { IoIosAddCircle } from 'react-icons/io'
import { TiDelete } from 'react-icons/ti'
import { RiEditCircleFill } from 'react-icons/ri'
import { AiFillDelete } from 'react-icons/ai'
import { TbBracketsContainStart, TbBracketsContainEnd } from 'react-icons/tb'


let Modes: string[] = [
    'Move',
    'Add',
    'Delete',
    'Edit',
    'Clear',
    'Stack push',
    'Stack pop',
    'Color',
]
export default Modes;

let iconSize = '30px'
export let modesIcons = [
    <FiMove size={iconSize} />,
    <IoIosAddCircle size={iconSize} />,
    <TiDelete size={iconSize} />,
    <RiEditCircleFill size={iconSize} />,
    <AiFillDelete size={iconSize} />,
    <TbBracketsContainStart size={iconSize} />,
    <TbBracketsContainEnd size={iconSize} />,
    //The Color icon is added in L-maker.tsx
]