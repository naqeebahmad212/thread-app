"use server"

import { revalidatePath } from "next/cache"
import Thread from "../models/thread.model"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"

interface Thread {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}


export const CreateThread = async ({text, author, communityId, path}: Thread) => {

   try {
    await connectToDB()
    const createdThread= await Thread.create({text, author, community:null})

    // update user
    await User.findByIdAndUpdate(author, {
        $push: {
            threads: createdThread._id
        }
    })

    revalidatePath(path)
    
   } catch (error:any) {
    console.log(error)
    
   }
    
}

export const fetchPosts = async (pageNumber = 1 , pageSize = 20) => {
    const skipAmount= (pageNumber - 1) * pageSize
    try {
        await connectToDB()
        // post that have no parent. that are top level posts
        const posts= await Thread.find({parentId:{$in:[null , undefined]}})
        .sort({createdAt: 'desc'})
        .skip(skipAmount)
        .limit(pageSize)
        .populate({path: 'author', model: 'User'})
        .populate({path:'children',
        populate:{
            path: 'author', model: 'User',select:'_id parentId  image name'
        }
            
        })

        const totalPosts = await Thread.countDocuments({parentId:{$in:[null , undefined]}})
        const isNextPage = totalPosts > skipAmount + posts.length
        return {posts , isNextPage}
    } catch (error:any) {
        console.log(error)
    }
    
}


export const fetchThreadById = async (id: string) => {

    try {
// will populate community later
        await connectToDB()
        const post = await Thread.findById(id)
        .populate({path: 'author', model: 'User' , select:'_id id  image name'})
        .populate({path:'children',
            populate:[
                {path: 'author', model: 'User',select:'_id id parentId  image name'},
                {path:'children',model:'Thread',
                populate:{path:'author', model: 'User',select:'_id id parentId  image name'}
                }
            ]
        }).exec()

        return post
    
    }catch(error:any) {
        console.log(error)
    }
}



export const addCommentToThread = async (threadId: string, commentText: string, userId: string , path:string) => {

    try {
        await connectToDB() 

        const originalThread = await Thread.findById(threadId)

        if(!originalThread) 
            throw new Error("Thread not found")  
        
        
        // createNew thread comments
        const newThread = await Thread.create({
            text: commentText,
            author: userId,
            parentId: threadId
        })


        // update original thread
        originalThread.children.push(newThread._id)

        await originalThread.save()

        revalidatePath(path)
         

    }catch(error:any) {
        throw new Error(`Failed to add comment: ${error?.message}`)
        console.log(error)
    }
}


export const fetchUserPosts= async (userId:string)=>{

    try { 
        await connectToDB() 
        const userPosts= await User.findOne({id:userId})
        .populate({path: 'threads', model: 'Thread' , 
            populate:{path: 'children', model: 'Thread', 
                populate:{path:'author', model: 'User',select:' id  image name'}
            }
        })


        return userPosts

    } catch (error:any) {
        throw new Error(`Failed to fetch user posts: ${error?.message}`)
    }
}