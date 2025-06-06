"use server";

import { uploadImage } from "@/lib/cloudinary";
import { storePost, updatePostLikeStatus } from "@/lib/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function createPost(prevState, formData){
    
    const title = formData.get('title')
    const image = formData.get('image')
    const content = formData.get('content')
    let errors = []
    if(!title || !title.trim().length === 0){
      errors.push('Not title')
    }
    if(!image || image.size === 0){
      errors.push('Not image')
    }
    if(!content || !content.trim().length === 0){
      errors.push('Not content')
    }
    if(errors.length > 0){
      return {errors};
    }
    let imageUrl
    try {
        imageUrl = await uploadImage(image)
    } catch (error) {
        throw new Error('Image upload failed')
    }
  

    await storePost({
      imageUrl,
      title,
      content,
      userId: 1
    })
    revalidatePath('/', 'layout');
    redirect('/feed')
  }


  export  async function togglePostLikeStatus(postId) {
    await updatePostLikeStatus(postId,2)
    revalidatePath('/', 'layout');
  }