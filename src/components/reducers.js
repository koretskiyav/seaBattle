import { combineReducers }    from 'redux';
import { routerStateReducer as router } from 'redux-router';

import { reducer as error     } from './modules/error'
import { reducer as success   } from './modules/success'
import { reducer as auth      } from './modules/auth'
import { reducer as version   } from './modules/version'
import { reducer as account   } from './modules/account'
import { reducer as strategy  } from './modules/strategy'
import { reducer as process   } from './modules/process'
import { reducer as template  } from './modules/template'
import { reducer as alert     } from './modules/alert'
import { reducer as trade     } from './modules/trade'
import { reducer as contract  } from './modules/contract'
import { reducer as instrument} from './modules/instrument'
import { reducer as strategyTradeReport} from './modules/strategyTradeReport'

export default combineReducers({
  router,   
  error,
  success,
  auth,
  version,
  account,
  strategy,
  process,
  template,
  alert,
  trade,
  contract,
  instrument,
  strategyTradeReport,
});