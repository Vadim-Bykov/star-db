import React, { Component } from 'react';

import './item-details.css';
import Spinner from "../spinner";

const Record = ({ item, field, label }) => {
    return (
        <li className="list-group-item">
            <span className="term">{ label }</span>
            <span>{ item[field] }</span>
        </li>
    );
};

export  {
    Record
}

export default class ItemDetails extends Component {

    state = {
        item: null,
        image: null,
        loading: true
    };

    componentDidMount() {
        this.updateItem();
    }

    componentDidUpdate(prevProps) {
        if (this.props.itemId !== prevProps.itemId ||
            this.props.getData !== prevProps.getData ||
            this.props.getImageUrl !== prevProps.getImageUrl) {
            this.setState({
                loading: true
            });
            this.updateItem();
        }
    }

    onItemLoaded = (item) => {
        const { getImageUrl } = this.props;
        this.setState({
            item,
            image: getImageUrl(item),
            loading: false
        })
    };

    updateItem = () => {
        const { itemId, getData} = this.props;
        if (!itemId) {
            return;
        }

        getData(itemId)
            .then(this.onItemLoaded);
    };

    render() {

        const { item, image, loading } = this.state;

        const { children } = this.props;


        if (!item) {
            return <span>Select a person from a list</span>
        }

        const hasData = !loading;

        const spinner = loading ? <Spinner /> : null;
        const content = hasData ? <ItemView item={item} image={image} children={children}/> : null;


        return (
            <div className="item-details card">
                {spinner}
                {content}
            </div>
        )
    }
}

const ItemView = ({ item, image, children }) => {

    const { name } = item;

    return (
        <React.Fragment>
            <img className="item-image"
                 src={ image }
                 alt="character"/>

            <div className="card-body">
                <h4>{ name }</h4>
                <ul className="list-group list-group-flush">
                    { React.Children.map(children, (child) => {
                            return React.cloneElement(child, { item });
                        })
                    }

                </ul>
            </div>
        </React.Fragment>
    );
};
