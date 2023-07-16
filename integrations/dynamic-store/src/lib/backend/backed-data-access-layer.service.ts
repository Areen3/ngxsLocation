import { IEntity } from '../model/base/base';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export abstract class BackedDataAccessLayerService<TEntity extends IEntity> {
  entities: Array<TEntity> = [];

  addEntity(entity: TEntity): Observable<TEntity> {
    return of(entity).pipe(
      tap(item => this.checkExistEntity(item.id)),
      map(item => {
        this.entities.push(item);
        return item;
      })
    );
  }

  removeEntity(entity: TEntity): Observable<TEntity> {
    return of(entity).pipe(
      map(item => {
        this.entities = this.entities.filter(item => item.id !== entity.id);
        return item;
      })
    );
  }

  getEntityById(id: number): Observable<TEntity> {
    const result = this.checkExistEntity(id, false);
    if (!result) {
      throw new Error(`You try get not existing entity: ${id}`);
    }
    return of(result);
  }

  checkExistEntity(entityId: number, withThrow = true): TEntity {
    const entityExist = <TEntity>this.entities.find(item => item.id === entityId);
    if (entityExist! && withThrow) {
      throw new Error(`You try add existing entity: ${entityExist}`);
    }
    return entityExist;
  }
}
