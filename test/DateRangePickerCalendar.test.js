import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { startOfMonth, addDays } from 'date-fns'
import { enGB as locale } from 'date-fns/locale'
import { START_DATE, END_DATE } from '../src/constants'
import DateRangePickerCalendar from '../src/DateRangePickerCalendar'

describe('DateRangePickerCalendar', () => {
  it('should render', () => {
    const { getAllByText } = render(
      <DateRangePickerCalendar
        locale={locale}
        onStartDateChange={() => {}}
        onEndDateChange={() => {}}
        onFocusChange={() => {}}
      />
    )

    expect(getAllByText('1').length).toBeGreaterThan(0)
  })

  it('should call callbacks on date selection', () => {
    const handleStartDateChange = jest.fn()
    const handleEndDateChange = jest.fn()
    const handleFocusChange = jest.fn()

    const { getAllByText, rerender } = render(
      <DateRangePickerCalendar
        locale={locale}
        focus={START_DATE}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onFocusChange={handleFocusChange}
      />
    )

    fireEvent.click(getAllByText('1')[0])

    expect(handleStartDateChange).toHaveBeenCalledTimes(1)
    expect(handleEndDateChange).toHaveBeenCalledTimes(0)
    expect(handleFocusChange).toHaveBeenCalledWith(END_DATE)

    rerender(
      <DateRangePickerCalendar
        locale={locale}
        focus={END_DATE}
        startDate={startOfMonth(new Date())}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onFocusChange={handleFocusChange}
      />
    )

    fireEvent.click(getAllByText('2')[0])

    expect(handleStartDateChange).toHaveBeenCalledTimes(1)
    expect(handleEndDateChange).toHaveBeenCalledTimes(1)
    expect(handleFocusChange).toHaveBeenCalledWith(null)
  })

  it('should display selected date range', () => {
    const startDate = startOfMonth(new Date())
    const endDate = addDays(startDate, 2)

    const { container, getAllByText, rerender } = render(
      <DateRangePickerCalendar
        locale={locale}
        startDate={startDate}
      />
    )

    expect(getAllByText('1')[0].parentElement).toHaveClass('-selected')
    expect(container.querySelectorAll('.-selected').length).toBe(1)

    rerender(
      <DateRangePickerCalendar
        locale={locale}
        startDate={startDate}
        endDate={endDate}
      />
    )

    expect(getAllByText('1')[0].parentElement).toHaveClass('-selected -selected-start')
    expect(getAllByText('2')[0].parentElement).toHaveClass('-selected -selected-middle')
    expect(getAllByText('3')[0].parentElement).toHaveClass('-selected -selected-end')
    expect(container.querySelectorAll('.-selected').length).toBe(3)
  })
})
