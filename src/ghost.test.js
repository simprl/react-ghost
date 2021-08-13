import { create } from 'react-test-renderer'
import { ghost, ghosts } from './index';

const Ghost = () => {
    return null;
};

describe('init', () => {
    test('create app actor', () => {
        const mainGhost = create(ghosts(ghost(Ghost)));
        expect(mainGhost.toJSON()).toMatchSnapshot();
    });
});
