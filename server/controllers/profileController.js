import {prisma} from "../prisma/index.js";


/**
 * What does this function do?
 * This function handles when a user wants to follow another profile
 *
 * What inputs does it expect?
 * Token and the id of the profile from the params
 *
 * What does it return or send back?
 * A variable that is either true or false based on follow or unfollow and a message
 */

export const follow = async (req, res) => {
    try {

        const userIDFromToken = req.user.id; // Id of token
        const {profile_id} = req.params; // Id of the profile
        let unfollowed = true; // State to keep track of action

        // Prevent users from following themselves
        if (userIDFromToken === profile_id) {
            return res.status(400).json({ message: "You can't follow yourself." });
        }

        // Check if the already follow
        let follows = false;

        // Already following?
        const alreadyFollowing = await prisma.follows.findFirst({
            where: {
                follower_id: userIDFromToken,
                followed_id: profile_id,
            }
        });

        // Yes, then unfollow
        if (alreadyFollowing) {
            await prisma.follows.delete({
                where: { id: alreadyFollowing.id }
            });

            return res.status(200).json({
                message: 'Unfollow',
                follows,
                unfollowed
            });
        }

        // No, follow
        unfollowed = false;

        // Insert follow
        await prisma.follows.create({
            data: {
                follower_id: userIDFromToken,
                followed_id: profile_id,
            }
        });

        follows = true;

        // Return
        return res.status(200).json({
            follows,
            unfollowed
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'An error occurred while trying to follow this profile',
            error: err.code || err.message
        });
    }
};

/**
 * What does this function do?
 * This function fetches the followers assocaited with a users profile
 *
 * What inputs does it expect?
 * Id of the profile, appended in another middleware
 *
 * What does it return or send back?
 * Just appends the users the profile is followed by and following
 */


export const fetchFollowers = async (req, res, next) => {

    try {

        const inspectedUserProfile = res.locals.inspectedUserProfile; // Id from middleware

        // Get the users following the profile
        const followers = await prisma.follows.findMany({
            where: {
                followed_id: inspectedUserProfile.id,
            }
        })

        // Get the users the profile is following
        const following = await prisma.follows.findMany({
            where: {
                follower_id: inspectedUserProfile.id,
            }
        })

        res.locals.followers = followers;
        res.locals.following = following;

        next();

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'An error occured while fetching followers', error: err,
        })
    }
}


/**
 * What does this function do?
 * This function acts like middleware, tying all the previous funtions togheter and sending
 * a complete dataset to the front-end
 *
 * What inputs does it expect?
 * Only the variables appended to the req object from the previous functions
 *
 * What does it return or send back?
 * A dataset of several functions
 */

export const sendProfileData = async (req, res) => {
    res.status(200).json({
        user: res.locals.inspectedUserProfile,
        posts: res.locals.posts,
        followers: res.locals.followers,
        following: res.locals.following,
        archive: res.locals.archivedPosts,
    });
}

/**
 * What does this function do?
 * This function fetches all the posts associated with a profile
 *
 * What inputs does it expect?
 * Id from the token and the username of the profile
 *
 * What does it return or send back?
 * It returns an array containing all the posts associated with that profile
 */

export const fetchPosts = async (req, res, next) => {

    try {

        const userIDFromToken = req.user.id; // Id from token
        const username = decodeURIComponent(req.params.username); // Username from params
        let archivedPosts; // Variable to hold the archived posts

        // Find the user of the inspectedprofile
        const inspectedUserProfile = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        // No user, return
        if (!inspectedUserProfile) {
            return res.status(404).json({
                message: 'User not found',
            })
        }

        // Find the posts
        const posts = await prisma.post.findMany({
            where: {
                user_id: inspectedUserProfile.id,
                archived: false
            },
            include: {
                images: true,
                poster: true,
                comments: {
                    include: {
                        user: true,
                    },
                },
                likes: true,
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        // If the user is inspecting their own profile, then also send the archived posts
        if (inspectedUserProfile.id === userIDFromToken) {
            archivedPosts = await prisma.post.findMany({
                where: {
                    archived: true,
                    user_id: userIDFromToken
                },
                include: {
                    images: true,
                    poster: true,
                    comments: {
                        include: {
                            user: true,
                        },
                    },
                    likes: true,
                },
                orderBy: {
                    created_at: 'desc'
                }
            })
        }

        res.locals.inspectedUserProfile = inspectedUserProfile;
        res.locals.archivedPosts = archivedPosts;
        res.locals.posts = posts;
        next();

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'An error occurred while fetching the posts associated with this profile', error: err
        })
    }
}


/**
 * What does this function do?
 * It fetches all the associated data to a single post, like comments and likes
 *
 * What inputs does it expect?
 * Token and id of the post from the params
 *
 * What does it return or send back?
 * An object containing the likes, images and comments associated with the post
 */


export const inspectSinglePost = async (req, res) => {

    try {

        const postID = parseInt(req.params.post_id); // Id of the post
        const userIdFromToken = req.user.id; // Id from token

        // Check if it is the users own post
        const usersOwnPost = await prisma.post.findUnique({
            where: {
                id: postID,
                user_id: userIdFromToken,
            }, include: {
                images: true,
                poster: true,
                comments: {
                    include: {
                        user: true,
                    },
                },
                likes: true,
            }
        })


        if (usersOwnPost)
            return res.status(200).json(usersOwnPost)

        // Fetch the other post
        const post = await prisma.post.findUnique({
            where: {
                id: postID,
                archived: false
            }, include: {
                images: true,
                poster: true,
                comments: {
                    include: {
                        user: true,
                    },
                },
                likes: true,
            }
        })

        return res.status(200).json(post)

    } catch (err) {
        console.log(err)
        res.status(500).json({message: 'Something went wrong', error: err});
    }
}

/**
 * What does this function do?
 * This function initiates a new conversation between two users when one of them
 * clicks "Message" in the Profile.jsx component
 *
 * What inputs does it expect?
 * Token and the username of the other user
 *
 * What does it return or send back?
 * It returns the conversation id that will be used by the navigation hook to fetch the conversation data
 */


export const fetchConversation = async (req, res) => {

    try {

        const userId = req.user.id // Id from the token
        const profileUsername = req.params.username; // Username of the opposite user


        // Fetch the profile
        const oppositeProfile = await prisma.user.findFirst({
            where: {
                username: profileUsername
            }
        })

        // Users should not be able to send messages to themselves
        if (oppositeProfile.id === userId) {
            return res.status(200).json({
                message: 'Wrong profile ID!'
            })
        }

        // Find if there is current conversation
        const userConversations = await prisma.conversationMember.findMany({
            where: {
                user_id: userId,
            },
            select: {
                conversation_id: true,
            },
        });

        // Get all the id of thoose conversation
        const conversationIds = userConversations.map(c => c.conversation_id);

        // Is there a shared conversation
        let sharedConversation = await prisma.conversationMember.findFirst({
            where: {
                conversation_id: {
                    in: conversationIds,
                },
                user_id: oppositeProfile.id,
            },
            include: {
                conversation: true,
            },
        });

        // No, then create it
        if (!sharedConversation) {
            const createConversation = await prisma.conversation.create({
                data: {}
            });

            await prisma.conversationMember.createMany({
                data: [
                    { conversation_id: createConversation.id, user_id: userId },
                    { conversation_id: createConversation.id, user_id: oppositeProfile.id },
                ],
            });

            sharedConversation = await prisma.conversationMember.findFirst({
                where: {
                    conversation_id: createConversation.id,
                    user_id: userId, // or inspectedUserId — either works here
                },
                include: {
                    conversation: true,
                },
            });
        }

        // Return the id of the new or old conversation
        res.status(200).json({
            conversationId: sharedConversation.conversation_id,
            message: 'Conversation was successfully created',
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Something went wrong initiating the conversation',
            error: err
        });
    }
}

