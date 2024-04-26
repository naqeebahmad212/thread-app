"use server"

import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import { FilterQuery, SortOrder } from "mongoose";
import Thread from "../models/thread.model";
import Community from "../models/community.model";


interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
  }

export const  updateUser = async (
{userId ,username,name,bio,image,path}:Params
) : Promise<void> => {

    connectToDB()

    try {
        await User.findOneAndUpdate({id: userId},{
            username: username.toLowerCase(),
            name: name,
            bio: bio,
            image: image,
            onboardedStatus: true,
            
        },
        {upsert:true}
    )
    
    if(path === '/profile/edit'){
        revalidatePath(path)
    }    
        
    } catch (error:any) {
        console.log(error)
        throw new Error(`Failed to update user: ${error?.message}`)
        
    }
}


export const fetchUser = async (userId: string) => {

    connectToDB()
   try {
    const user = await User.findOne({id:userId})
    .populate({
        path: "communities",
        model: Community,
      });
    // .populate('threads')
    return user
    
   } catch (error:any) {
    console.log(error)
    throw new Error(`Failed to fetch user: ${error?.message}`)
    
   }
}

export async function fetchUserPosts(userId: string) {
    try {
        connectToDB();
    
        // Find all threads authored by the user with the given userId
        const threads = await User.findOne({ id: userId }).populate({
          path: "threads",
          model: Thread,
          populate: [
            {
              path: "community",
              model: Community,
              select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
            },
            {
              path: "children",
              model: Thread,
              populate: {
                path: "author",
                model: User,
                select: "name image id", // Select the "name" and "_id" fields from the "User" model
              },
            },
          ],
        });
        return threads;
      } catch (error) {
        console.error("Error fetching user threads:", error);
        throw error;
      }
}


export const fetchUsers = async ({
    userId,
    searchTerm,
    pageNumber = 1,
    pageSize=20,
    sortBy = 'desc',
}:{userId:string , searchTerm?:string , pageNumber?:number , pageSize?:number , sortBy?:SortOrder} ) => {
    try {
        await connectToDB()

        const skipAmount = (pageNumber - 1) * pageSize

        const regex = new RegExp(searchTerm as string, 'i')
        const query:FilterQuery<typeof User> = {
            id: { $ne: userId },
        }

        if(searchTerm?.trim() !== '') {
            query.$or = [
                {username : { $regex: regex }},
                {name : { $regex: regex }}
            ]
        }

        const sortOption = {createdAt : sortBy}

        const userQuery= await User.find(query)
        .sort(sortOption)
        .skip(skipAmount)
        .limit(pageSize)

        const totalUsers = await User.countDocuments(query)

        const isNextPage = totalUsers > skipAmount + userQuery.length

        return { userQuery , isNextPage }
    } catch (error:any) {
        throw new Error(`Failed to fetch users: ${error?.message}`)
    }
}



export const getActivities=async(userId:string)=> {

    try {
        await connectToDB()
        // find all the threads created by the user
        const userThreads = await Thread.find({author:userId})
        
        // now collect children ids for each thread
        
        const childrenThreadIds = userThreads.reduce((acc, userThread) => {
            
            return  acc.concat(userThread.children)
        },[])

        const replies= await Thread.find({_id: {$in: childrenThreadIds} , author:{$ne:userId}})
        .populate({path: 'author', model: 'User' , select:'_id   image name'})

        return replies

    } catch (error:any) {
        throw new Error(`Failed to get activities: ${error?.message}`)
    }

    
}
    
