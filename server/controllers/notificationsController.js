



export const loadNotifications = async (req, res) => {

    try {

        const {user_id} = req.params

    } catch (err) {

        console.error(err.message);
        res.status(500).json('Server Error');
    }




}