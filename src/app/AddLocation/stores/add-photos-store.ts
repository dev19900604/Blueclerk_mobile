import { task } from 'mobx-task';
import { observable } from 'mobx';
import { uploadImage } from '../api';

export default class AddPhotosStore {
  @observable public localUris: string[] = [];

  public imageUrls: string[] = [];

  @task.resolved
  public async addImage(uri: string) {
    this.localUris.push(uri);
    const {
      data: { imageUrl },
    } = await uploadImage(uri);

    this.imageUrls.push(imageUrl);
  }
}
