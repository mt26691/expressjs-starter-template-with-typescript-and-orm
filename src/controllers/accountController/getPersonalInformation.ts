import { Database } from '../../database/database';
import { BadRequest } from '../../components/exceptions';

/**
	* Get current user information
	* @param req Request
	* @param res Response
	*/
export async function getPersonalInformation(req: any, res: any, next: any) {
	const user = await Database.userRepository.findUserById(req.user.id);

	if (!user) {
		return next(new BadRequest('User not found'));
	}
	// return user information
	res.success({
		id: user.id,
		email: user.email,
		isVerified: user.isVerified
	});
}
