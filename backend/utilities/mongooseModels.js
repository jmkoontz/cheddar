import mongoose from 'mongoose';

import {userSchema} from './mongooseSchemas';

export const userModel = mongoose.model('User', userSchema);
