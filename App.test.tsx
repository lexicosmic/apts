import React from 'react';
import chalk from 'chalk';
import {render} from 'ink-testing-library';
import App from './src/App.tsx';

test('greet unknown user', () => {
	const {lastFrame} = render(<App /*name={undefined}*/ />);

	expect(lastFrame()).toBe(`Hello, ${chalk.green('Stranger')}`);
});

test('greet user with a name', () => {
	const {lastFrame} = render(<App /*name="Jane"*/ />);

	expect(lastFrame()).toBe(`Hello, ${chalk.green('Jane')}`);
});
