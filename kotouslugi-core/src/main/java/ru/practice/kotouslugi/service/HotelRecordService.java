package ru.practice.kotouslugi.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.HotelRecordRepository;
import ru.practice.kotouslugi.model.HotelRecord;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Service
public class HotelRecordService {
    private final HotelRecordRepository hotelRecordRepository;
    private static final Logger logger = LoggerFactory.getLogger(HotelRecordService.class);

    public HotelRecordService(HotelRecordRepository hotelRecordRepository) {
        this.hotelRecordRepository = hotelRecordRepository;
    }

    //Сохраняет запись о передержке кота
    public Long overexposure(HotelRecord record) {
        try {
            if (record.getIdCat() == null || record.getIdHotel() == null ||
                record.getRecordStart() == null || record.getRecordFinish() == null) {
                throw new IllegalArgumentException("Все поля записи должны быть заполнены");
            }
            record.setRecordStat("PENDING"); // Устанавливаем статус по умолчанию
            record = hotelRecordRepository.save(record);
            logger.info("Создана запись на передержку: кот ID = {}, отель ID = {}",
                record.getIdCat(), record.getIdHotel());
            return record.getIdRecord();
        } catch (Exception e) {
            logger.error("Ошибка при создании записи на передержку: {}", e.getMessage());
            return null;
        }
    }

    //Проверяет наличие свободных мест в отеле на указанные даты
    public boolean spaceCheck(Long hotelId, LocalDateTime start, LocalDateTime finish) {
        try {
            List<HotelRecord> records = listRecords();
            long overlappingRecords = records.stream()
                .filter(record -> record.getIdHotel().equals(hotelId))
                .filter(record -> !(record.getRecordFinish().isBefore(start) || record.getRecordStart().isAfter(finish)))
                .count();
            // 10 мест - максимально
            boolean hasSpace = overlappingRecords < 10;
            if (!hasSpace) {
                logger.warn("Нет свободных мест в отеле ID = {} на даты с {} по {}",
                    hotelId, start, finish);
            }
            return hasSpace;
        } catch (Exception e) {
            logger.error("Ошибка при проверке наличия мест: {}", e.getMessage());
            return false;
        }
    }

    //Возвращает список всех записей
    public List<HotelRecord> listRecords() {
        List<HotelRecord> list = new LinkedList<>();
        hotelRecordRepository.findAll().forEach(list::add);
        return list;
    }

    //Получает запись по ID
    public HotelRecord getRecord(Long id) {
        Optional<HotelRecord> record = hotelRecordRepository.findById(id);
        return record.orElse(null);
    }

    //Удаляет запись по ID
    public void deleteRecord(Long id) {
        Optional<HotelRecord> record = hotelRecordRepository.findById(id);
        record.ifPresent(hotelRecordRepository::delete);
    }
}
