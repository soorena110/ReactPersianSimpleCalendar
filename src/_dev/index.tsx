import * as React from 'react';
import {render} from "react-dom";
import DatePicker from "../DatePicker";

declare const module: any;

class MainApplication extends React.Component {


    render() {
        return <div>
            <div><DatePicker selectedDay="1398/8/9"/></div>
        </div>
    }
}

render(
    <MainApplication/>,
    document.getElementById("root")
);

module.hot.accept();