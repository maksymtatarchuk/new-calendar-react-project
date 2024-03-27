import styled from '@emotion/styled';

interface ColorTagProps {
    color: string;
    isSelected: boolean;
    isLarge: boolean;
}

const ColorTag = styled.div<ColorTagProps>`
    margin: 5px 3px 0 1px;
    background-color: ${props => props.color};

    ${props => props.isLarge ? `
        border-radius: 10px;
        border: 2px solid ${props.color};
        background-color: rgba(0, 0, 0, 0);
        width: 16px;
        height: 16px;
    ` : `
        border-radius: 5px;
        width: 10px;
        height: 10px;
    `}

    ${props => props.isSelected ? `
        background-color: ${props.color};
    `: ``}

    &:hover {
        box-shadow: 0 0 6px ${props => props.color};
        cursor: pointer;
    }
`;



export default ColorTag