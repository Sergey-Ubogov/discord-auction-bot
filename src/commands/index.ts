import { ReloadCommand } from './utility/reload.js';
import { StartAucCommand } from './utility/start-auc.js';
import { StopAucCommand } from './utility/stop-auc.js';

export const AllCommands = [StartAucCommand, StopAucCommand, ReloadCommand];
