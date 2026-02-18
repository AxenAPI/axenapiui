import { axiosClient, getApiConfig } from '@shared/api';
import { Broker, BrokersApiFactory } from '@shared/openapi';

const api = BrokersApiFactory(getApiConfig(), undefined, axiosClient);

export class BrokersService {
  /**
   * Добавляет новый брокер.
   * @param broker Объект брокера для добавления.
   * @returns {Promise<Broker>} Созданный брокер.
   */
  static async addBroker(broker: Broker) {
    const { data } = await api.addBroker({ broker });
    return data;
  }

  /**
   * Удаляет брокер по ID.
   * @param id ID брокера для удаления.
   * @returns {Promise<void>}
   */
  static async deleteBroker(id: string) {
    const { data } = await api.deleteBroker({ id });
    return data;
  }

  /**
   * Получает список всех брокеров.
   * @returns {Promise<Broker[]>} Список брокеров.
   */
  static async getAllBrokers() {
    const { data } = await api.getAllBrokers();
    return data;
  }

  /**
   * Получает брокер по ID.
   * @param id ID брокера.
   * @returns {Promise<Broker>} Найденный брокер.
   */
  static async getBrokerById(id: string) {
    const { data } = await api.getBrokerById({ id });
    return data;
  }
}
