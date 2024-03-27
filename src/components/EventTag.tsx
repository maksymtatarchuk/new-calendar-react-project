import styled from '@emotion/styled';

interface EventTagProps {
    isLarge: boolean;
    isSelected: boolean;
}

const EventTag = styled.div<EventTagProps>`
    display: flex;
    justify-content: space-around;
    border-radius: 7px;
    user-select: none;
    cursor: pointer;
    background-color: rgba(64, 224, 208, 0.75);
    font-size: small;

    ${props => props.isLarge ? `
        margin: 2px 2px;
        padding: 2px 7px;

        &:hover {
            border: 1px solid white;
            margin: 1px 1px;
            text-decoration: line-through;
        }
    `: `
        font-size: x-small;
        margin: 2px 2px 2px 1px;
        padding: 0 4px;
    `}

    ${props => props.isSelected ? `
        font-weight: bold;
        color: rgb(255, 115, 115);
        padding: 0 3px;
    ` : ``}
`;

export default EventTag