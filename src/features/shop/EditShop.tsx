import React, { FC, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Shop, shopById, updateShop } from './shopSlice';
import { RouteComponentProps } from 'react-router-dom';
import NewEditShop from './NewEditShop';

type EditShopRouteProps = {
  shopId: string;
}

const EditShop: FC<RouteComponentProps<EditShopRouteProps>> = ({match}): ReactElement => {

    const shopId: string = match.params.shopId
    const shop: Shop | undefined = useSelector(shopById(shopId));

    return (
      <NewEditShop
        title="Edit Shop"
        label="Change shop name..."
        shop={shop}
        thunkAction={updateShop} />
    );
};

export default EditShop;
