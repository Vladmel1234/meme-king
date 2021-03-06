import { combineReducers } from 'redux';

// reducers
import isSideBarOpen from './reducer_sidemenu';
import categoryReducer from './category-reducer';
import searchReducer from './search-reducer';
import userMessagesReducer from './user-messages-reducer';
import notificationReducer from './notifications-reducer';

const rootReducer = combineReducers({
    isSideBarOpen: isSideBarOpen,
    category: categoryReducer,
    search: searchReducer,
    userMessages: userMessagesReducer,
    notifications: notificationReducer,
});

export default rootReducer;
