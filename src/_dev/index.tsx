import * as React from 'react';
import {render} from "react-dom";
import DatePicker from "../DatePicker";

declare const module: any;

class MainApplication extends React.Component {


    render() {
        return <div>
            <DatePicker selectedDay="1398/8/9" onDaySelected={event => console.log(event.selectedDay)}/>
        </div>
    }
}

render(
    <MainApplication/>,
    document.getElementById("root")
);

module.hot.accept();