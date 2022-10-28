import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import TaskComponent from "../components/TaskComponent";


// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Todolist/TaskComponent',
    component: TaskComponent,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    args: {
        changeTaskStatus: action('changeTaskStatus'),
        removeTask: action('removeTask'),
        ChangeTaskTitle: action('ChangeTaskTitle'),
        todolistId: '1111',
        t: {id: 'qwer', title: 'js', isDone: true}

    }
} as ComponentMeta<typeof TaskComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TaskComponent> = (args) => <TaskComponent {...args} />;

export const TaskIsDOneStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TaskIsDOneStory.args = {};

export const TaskIsNotDOneStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TaskIsNotDOneStory.args = {
    t: {id: 'qwer', title: 'js', isDone: false}
};

